<template>
  <UApp class="">
    <ConfigLoading v-if="!configStore.isLoaded" />
    <div v-else-if="selectedConfig === undefined">
      <div class="flex flex-col justify-center items-center h-screen container mx-auto">
        <div class="text-3xl font-bold mb-4">
          No configuration selected.
        </div>
        <div
          v-if="configStore.configs.length === 0"
          class="text-lg text-muted"
        >
          No configs available. Please run some qualitative analysis first.
        </div>
        <div
          v-if="configStore.configs.length > 0"
          class="text-lg text-muted"
        >
          Please select a config:
        </div>
        <ConfigSelection
          v-if="configStore.configs.length > 0"
          @confirm="setActiveConfig"
        />
      </div>
    </div>
    <div
      v-else
      class="flex flex-col p-4 h-screen w-screen gap-4"
      @contextmenu.prevent
    >
      <div class="flex">
        <HeaderContainer>
          <HeaderButton
            icon="i-lucide-move-left"
            @click="goToPreviousImage"
          />
          <HeaderTitle :title="image" />
          <HeaderButton
            icon="i-lucide-move-right"
            @click="goToNextImage"
          />
        </HeaderContainer>
        <HeaderContainer>
          <div />
          <UButton
            size="xl"
            color="secondary"
            label="Select Config"
            @click="changeConfig()"
          />
          <UButton
            label="Copy active view"
            size="xl"
            variant="outline"
            trailing-icon="lucide-share"
            @click="copyActiveView"
          />
          <UButton
            label="Download Images"
            size="xl"
            variant="outline"
            color="neutral"
            trailing-icon="lucide-download"
            :loading="isDownloadingImages"
            :disabled="isDownloadingImages"
            @click="downloadImages"
          />
        </HeaderContainer>
      </div>
      <USeparator color="primary" />
      <div
        class="flex w-full items-center"
        @wheel.prevent="adjustAlpha"
      >
        <div class="flex-2 flex-col">
          <div class="flex gap-2 justify-center">
            <div class="flex gap-1 items-center p-1">
              <div class="bg-primary size-2 rounded-full" />
              <div class="text-sm">
                Base Image
              </div>
              <UIcon name="ph:mouse-left-click-fill" />
            </div>
            <div />
            <div class="flex gap-1 items-center">
              <div class="bg-secondary size-2 rounded-full" />
              <div class="text-sm">
                Overlay Image
              </div>
              <UIcon name="ph:mouse-right-click-fill" />
            </div>
            <div />
            <div
              v-if="secondaryImagePath"
              class="flex gap-1 items-center"
            >
              <div class="text-sm">
                Change Overlay Alpha
              </div>
              <UIcon name="iconoir:mouse-scroll-wheel" />
            </div>
          </div>
          <ImageCompare
            v-model:alpha="alpha"
            :base-image="primaryImagePath"
            :overlay-image="secondaryImagePath"
          />
        </div>
        <div class="flex-2">
          <ImageOverview
            v-if="!configChange"
            v-model:primary="primaryImage"
            v-model:secondary="secondaryImage"
            :config="configQuery"
            :image="image"
          />
          <ConfigSelection
            v-else
            class="p-4"
            @confirm="setActiveConfig"
          />
        </div>
      </div>
      <USeparator color="primary" />
      <div class="flex gap-4 h-full">
        <div class="flex-4 flex flex-col gap-2">
          <div class="text-lg text-center">
            Image statistics
          </div>
          <USeparator color="primary" />
          <div class="flex justify-stretch gap-2 h-full">
            <StatsImageExitSlider
              :metrics="resultStore.exitMetrics.exit2"
              :image-results="imageResults('exit2')"
              title="Exit 2"
              class="flex-1"
            />
            <StatsImageExitSlider
              :metrics="resultStore.exitMetrics.exit3"
              :image-results="imageResults('exit3')"
              title="Exit 3"
              class="flex-1"
            />
            <StatsImageExitSlider
              :metrics="resultStore.exitMetrics.exit4"
              :image-results="imageResults('exit4')"
              title="Exit 4"
              class="flex-1"
            />
          </div>
        </div>
        <USeparator 
          color="primary" 
          orientation="vertical" 
        />
        <Shortcuts 
          class="flex-2" 
          @navigate="goToImage" 
        />
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import JSZip from 'jszip'
import { useResultStore } from './composables/stores/ResultsStore'
import { useConfigStore } from './composables/stores/ConfigStore'

const resultStore = useResultStore()
const configStore = useConfigStore()

const router = useRouter()

onMounted(() => {
  configStore.loadConfigs()
})

const title = 'Qualitative Analysis Tool'
const description
  = 'A tool for conducting qualitative analysis on the results of anytime prediction segmentation results.'

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const { getImagePath } = useImageResolver()

const route = useRoute()
const toast = useToast()

const image = ref(typeof route.query.img === 'string' ? route.query.img : 'frankfurt_000000_000576')
const selectedConfig = ref<number | undefined>(route.query.config && typeof route.query.config === 'string' ? Number(route.query.config) : undefined)

const primaryImage = ref<ImageIdentifier>({ type: ImageType.Real, exit: 1 })
const secondaryImage = ref<ImageIdentifier>({ type: ImageType.GT, exit: 1 })

const primaryImagePath = computed(() => getImagePath(image.value, primaryImage.value, configQuery.value as Record<string, string>))
const secondaryImagePath = computed(() => getImagePath(image.value, secondaryImage.value, configQuery.value as Record<string, string>))
const alpha = ref([0.5])
const isDownloadingImages = ref(false)

const configChange = ref(false)

const config = computed(() => {
  if (selectedConfig.value === undefined) return undefined
  return configStore.configs[selectedConfig.value]
})

// query params required by the exit-specific image and results API endpoints
const configQuery = computed((): Record<string, string> => {
  if (!config.value) return {}
  return {
    device: config.value.device,
    kernel: config.value.kernel,
    startStage: String(config.value.startStage),
    branches: String(config.value.branches),
    threshold: String(config.value.threshold)
  }
})

watch(config, (newConfig) => {
  if (newConfig) {
    resultStore.fetchResults(newConfig, image.value)
  }
}, { immediate: true })

const setActiveConfig = (configIndex: number) => {
  selectedConfig.value = configIndex
  configChange.value = false
}

const imageResults = (exit: 'exit1' | 'exit2' | 'exit3' | 'exit4') => {
  if (!resultStore.imageResults[image.value]) {
    return {
      time_s: 0,
      mean_IoU: 0,
      pixel_acc: 0,
      mean_acc: 0,
      sparsity: 0,
      delta_time_s: 0,
      delta_mean_IoU: 0,
      delta_pixel_acc: 0,
      delta_mean_acc: 0
    }
  }
  return resultStore.imageResults[image.value]![exit]
}

function adjustAlpha(event: WheelEvent) {
  if (!secondaryImagePath.value) return

  const step = event.altKey ? 0.06 : 0.03
  const nextAlpha = (alpha.value[0] ? alpha.value[0] : 0) + (event.deltaY < 0 ? step : -step)

  alpha.value[0] = Math.min(1, Math.max(0, nextAlpha))
}

function goToNextImage() {
  const nextImageId = resultStore.getNextImageId(image.value)
  if (nextImageId) {
    image.value = nextImageId
  }
}
function goToPreviousImage() {
  const prevImageId = resultStore.getPreviousImageId(image.value)
  if (prevImageId) {
    image.value = prevImageId
  }
}

function copyActiveView() {
  const currentPath = router.currentRoute.value.fullPath
  const shareUrl = new URL(currentPath, window.location.origin).href + `?img=${image.value}&config=${selectedConfig.value}`

  if (!navigator.clipboard) {
    toast.add({
      title: `Failed to copy ${shareUrl}`,
      description: 'Copying requires HTTPS or localhost.',
      color: 'error'
    })
    router.replace(`?img=${image.value}&config=${selectedConfig.value}`)
    return
  }

  navigator.clipboard.writeText(shareUrl).then(() => {
    toast.add({
      title: 'Copied to clipboard!',
      description: shareUrl,
      color: 'success'
    })
  }).catch((error) => {
    console.error('Failed to copy:', error)
    toast.add({
      title: 'Copy failed',
      description: 'The browser denied clipboard access. Check the site permissions and try again.',
      color: 'error'
    })
  })
}

function changeConfig() {
  configChange.value = true
}

function goToImage(imageId: string) {
  if (imageId) {
    image.value = imageId
  }
}

async function downloadImages() {
  if (isDownloadingImages.value) return

  const imageFile = (filename: string, type: ImageType, exit: ImageIdentifier['exit']) => ({
    filename,
    identifier: { type, exit }
  })
  const exits = [] as (1 | 2 | 3 | 4)[]
  switch (config.value?.startStage ?? 1) {
    case 1:
      exits.push(2, 3, 4)
      break
    case 2:
      exits.push(3, 4)
      break
    case 3:
      exits.push(4)
      break
  }

  const images = [
    imageFile('real.png', ImageType.Real, 1),
    imageFile('ground-truth.png', ImageType.GT, 1),
    ...([1, 2, 3, 4] as const).map(exit => imageFile(`exit${exit}_prediction.png`, ImageType.Prediction, exit)),
    ...exits.flatMap(exit => [
      imageFile(`exit${exit}_pixel-mask.png`, ImageType.PixelMask, exit),
      imageFile(`exit${exit}_block-mask.png`, ImageType.BlockMask, exit)
    ])
  ]

  isDownloadingImages.value = true

  try {
    const archive = new JSZip()
    const resultsUrl = `/api/results/${image.value}?${new URLSearchParams(configQuery.value)}`
    const [files, resultsResponse] = await Promise.all([
      Promise.all(images.map(async ({ filename, identifier }) => {
        const response = await fetch(getImagePath(image.value, identifier, configQuery.value))
        if (!response.ok) {
          throw new Error(`Could not download ${filename}`)
        }

        return { filename, blob: await response.blob() }
      })),
      fetch(resultsUrl)
    ])

    if (!resultsResponse.ok) {
      throw new Error('Could not download results.json')
    }

    const allImageResults = await resultsResponse.json() as Record<string, unknown>
    const selectedImageResults = allImageResults[image.value]
    if (selectedImageResults === undefined) {
      throw new Error(`No results found for ${image.value}`)
    }

    for (const { filename, blob } of files) {
      archive.file(filename, blob)
    }
    archive.file('results.json', JSON.stringify({ [image.value]: selectedImageResults }, null, 2))

    const archiveBlob = await archive.generateAsync({ type: 'blob' })
    const downloadUrl = URL.createObjectURL(archiveBlob)
    const downloadLink = document.createElement('a')
    downloadLink.href = downloadUrl
    downloadLink.download = `${image.value}-images.zip`
    downloadLink.click()
    URL.revokeObjectURL(downloadUrl)

    toast.add({
      title: 'Image archive downloaded',
      description: `${image.value}-images.zip`,
      color: 'success'
    })
  } catch (error) {
    console.error('Failed to download image archive:', error)
    toast.add({
      title: 'Image download failed',
      description: error instanceof Error ? error.message : 'The image archive could not be created.',
      color: 'error'
    })
  } finally {
    isDownloadingImages.value = false
  }
}
</script>
