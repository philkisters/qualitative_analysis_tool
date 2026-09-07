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
            @click="selectedConfig = undefined"
          />
          <UButton
            label="Copy active view"
            size="xl"
            variant="outline"
            trailing-icon="lucide-share"
            @click="copyActiveView"
          />
        </HeaderContainer>
      </div>
      <USeparator />
      <div
        class="flex w-full"
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
              v-if="secondaryImage"
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
            :base-image="primaryImage"
            :overlay-image="secondaryImage"
          />
        </div>
        <div class="flex-2 flex flex-col gap-2">
          <div class="flex gap-2 items-center">
            <div class="flex-2 text-lg text-right">
              Raw Image
            </div>
            <PreviewImage
              :show="showImage(realImagePath(image))"
              :color="getColor(realImagePath(image))"
              :image-path="realImagePath(image)"
              @click="setPrimaryImage(realImagePath(image))"
              @contextmenu.prevent="setSecondaryImage(realImagePath(image))"
            />
            <PreviewImage
              :show="showImage(gtImagePath(image))"
              :color="getColor(gtImagePath(image))"
              :image-path="gtImagePath(image)"
              @click="setPrimaryImage(gtImagePath(image))"
              @contextmenu.prevent="setSecondaryImage(gtImagePath(image))"
            />
            <div class="flex-2 text-lg text-left">
              Ground Truth Labels
            </div>
          </div>
          <div class="flex gap-2 text-center text-lg font-bold">
            <div class="flex-2" />
            <div class="flex-2">
              Exit 1
            </div>
            <div class="flex-2">
              Exit 2
            </div>
            <div class="flex-2">
              Exit 3
            </div>
            <div class="flex-2">
              Exit 4
            </div>
          </div>
          <div class="flex gap-2 items-center">
            <div class="flex-2 text-lg text-center">
              Results
            </div>
            <PreviewImage
              :show="showImage(exitImagePath(image, 1, 'prediction'))"
              :color="getColor(exitImagePath(image, 1, 'prediction'))"
              :image-path="exitImagePath(image, 1, 'prediction')"
              @click="setPrimaryImage(exitImagePath(image, 1, 'prediction'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 1, 'prediction'))"
            />
            <PreviewImage
              :show="showImage(exitImagePath(image, 2, 'prediction'))"
              :color="getColor(exitImagePath(image, 2, 'prediction'))"
              :image-path="exitImagePath(image, 2, 'prediction')"
              @click="setPrimaryImage(exitImagePath(image, 2, 'prediction'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 2, 'prediction'))"
            />
            <PreviewImage
              :show="showImage(exitImagePath(image, 3, 'prediction'))"
              :color="getColor(exitImagePath(image, 3, 'prediction'))"
              :image-path="exitImagePath(image, 3, 'prediction')"
              @click="setPrimaryImage(exitImagePath(image, 3, 'prediction'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 3, 'prediction'))"
            />
            <PreviewImage
              :show="showImage(exitImagePath(image, 4, 'prediction'))"
              :color="getColor(exitImagePath(image, 4, 'prediction'))"
              :image-path="exitImagePath(image, 4, 'prediction')"
              @click="setPrimaryImage(exitImagePath(image, 4, 'prediction'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 4, 'prediction'))"
            />
          </div>
          <div class="flex gap-2 items-center">
            <div class="flex-2 text-lg text-center">
              Pixel Mask
            </div>
            <div class="flex-1" />
            <PreviewImage
              border
              :show="showImage(exitImagePath(image, 2, 'pixel_mask'))"
              :color="getColor(exitImagePath(image, 2, 'pixel_mask'))"
              :image-path="exitImagePath(image, 2, 'pixel_mask')"
              @click="setPrimaryImage(exitImagePath(image, 2, 'pixel_mask'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 2, 'pixel_mask'))"
            />
            <PreviewImage
              border
              :show="showImage(exitImagePath(image, 3, 'pixel_mask'))"
              :color="getColor(exitImagePath(image, 3, 'pixel_mask'))"
              :image-path="exitImagePath(image, 3, 'pixel_mask')"
              @click="setPrimaryImage(exitImagePath(image, 3, 'pixel_mask'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 3, 'pixel_mask'))"
            />
            <PreviewImage
              border
              :show="showImage(exitImagePath(image, 4, 'pixel_mask'))"
              :color="getColor(exitImagePath(image, 4, 'pixel_mask'))"
              :image-path="exitImagePath(image, 4, 'pixel_mask')"
              @click="setPrimaryImage(exitImagePath(image, 4, 'pixel_mask'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 4, 'pixel_mask'))"
            />
            <div class="flex-1" />
          </div>
          <div class="flex gap-2 items-center">
            <div class="flex-2 text-lg text-center">
              Block Mask
            </div>
            <div class="flex-1" />
            <PreviewImage
              border
              :show="showImage(exitImagePath(image, 2, 'block_mask'))"
              :color="getColor(exitImagePath(image, 2, 'block_mask'))"
              :image-path="exitImagePath(image, 2, 'block_mask')"
              @click="setPrimaryImage(exitImagePath(image, 2, 'block_mask'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 2, 'block_mask'))"
            />
            <PreviewImage
              :show="showImage(exitImagePath(image, 3, 'block_mask'))"
              :color="getColor(exitImagePath(image, 3, 'block_mask'))"
              :image-path="exitImagePath(image, 3, 'block_mask')"
              border
              @click="setPrimaryImage(exitImagePath(image, 3, 'block_mask'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 3, 'block_mask'))"
            />
            <PreviewImage
              :show="showImage(exitImagePath(image, 4, 'block_mask'))"
              :color="getColor(exitImagePath(image, 4, 'block_mask'))"
              :image-path="exitImagePath(image, 4, 'block_mask')"
              border
              @click="setPrimaryImage(exitImagePath(image, 4, 'block_mask'))"
              @contextmenu.prevent="setSecondaryImage(exitImagePath(image, 4, 'block_mask'))"
            />
            <div class="flex-1" />
          </div>
        </div>
      </div>
      <USeparator />
      <div class="text-center text-xl font-bold">
        Statistics
      </div>
      <div class="flex gap-4 h-full">
        <div class="flex-2 flex flex-col gap-2">
          <div class="text-lg text-center">
            Image statistics
          </div>
          <USeparator />
          <div class="grid grid-cols-2 gap-2 h-full">
            <StatsImageExitSlider
              :metrics="resultStore.exitMetrics.exit1"
              :image-results="imageResults('exit1')"
              title="Exit 1"
            />
            <StatsImageExitSlider
              :metrics="resultStore.exitMetrics.exit2"
              :image-results="imageResults('exit2')"
              title="Exit 2"
            />
            <StatsImageExitSlider
              :metrics="resultStore.exitMetrics.exit3"
              :image-results="imageResults('exit3')"
              title="Exit 3"
            />
            <StatsImageExitSlider
              :metrics="resultStore.exitMetrics.exit4"
              :image-results="imageResults('exit4')"
              title="Exit 4"
            />
          </div>
        </div>
        <USeparator orientation="vertical" />
        <div class="flex-2 flex flex-col gap-2">
          <div class="text-lg text-center">
            Class statistics
          </div>
          <USeparator />
        </div>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
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

const route = useRoute()
const toast = useToast()

const image = ref(typeof route.query.img === 'string' ? route.query.img : 'frankfurt_000000_000576')
const selectedConfig = ref<number | undefined>(route.query.config && typeof route.query.config === 'string' ? Number(route.query.config) : undefined)
const secondaryImage = ref<string | undefined>(undefined)
const alpha = ref([0.5])

const config = computed(() => {
  if (selectedConfig.value === undefined) return undefined
  return configStore.configs[selectedConfig.value]
})

// query params required by the exit-specific image and results API endpoints
const configQuery = computed(() => {
  if (!config.value) return {}
  return {
    device: config.value.device,
    kernel: config.value.kernel,
    startStage: config.value.startStage,
    branches: config.value.branches,
    threshold: config.value.threshold
  }
})

function realImagePath(imageId: string) {
  return `/api/images/${imageId}/real`
}
function gtImagePath(imageId: string) {
  return `/api/images/${imageId}/gt`
}
function exitImagePath(imageId: string, exit: 1 | 2 | 3 | 4, filename: 'prediction' | 'pixel_mask' | 'block_mask') {
  const params = new URLSearchParams(configQuery.value as Record<string, string>)
  return `/api/images/${imageId}/${exit}/${filename}?${params.toString()}`
}

const primaryImage = ref(realImagePath(image.value))

watch(config, (newConfig) => {
  if (newConfig) {
    resultStore.fetchResults(newConfig, image.value)
  }
}, { immediate: true })

const showImage = (imagePath: string) => {
  return primaryImage.value === imagePath || secondaryImage.value === imagePath
}
const getColor = (imagePath: string) => {
  return primaryImage.value === imagePath ? 'primary' : 'secondary'
}

const setActiveConfig = (configIndex: number) => {
  selectedConfig.value = configIndex
}

const imageResults = (exit: 'exit1' | 'exit2' | 'exit3' | 'exit4') => {
  if (!resultStore.imageResults[image.value]) {
    return {
      time_s: 0,
      mean_IoU: 0,
      pixel_acc: 0,
      mean_acc: 0,
      sparsity: 0
    }
  }
  return resultStore.imageResults[image.value]![exit]
}

function setPrimaryImage(imagePath: string) {
  primaryImage.value = imagePath
  if (primaryImage.value === secondaryImage.value) {
    secondaryImage.value = undefined
  }
}
function setSecondaryImage(imagePath: string) {
  secondaryImage.value = imagePath
  if (primaryImage.value === secondaryImage.value) {
    secondaryImage.value = undefined
  }
}

function adjustAlpha(event: WheelEvent) {
  if (!secondaryImage.value) return

  const step = event.altKey ? 0.06 : 0.03
  const nextAlpha = (alpha.value[0] ? alpha.value[0] : 0) + (event.deltaY < 0 ? step : -step)

  alpha.value[0] = Math.min(1, Math.max(0, nextAlpha))
}

function goToNextImage() {
  const nextImageId = resultStore.getNextImageId(image.value)
  if (nextImageId) {
    image.value = nextImageId
    primaryImage.value = realImagePath(nextImageId)
    secondaryImage.value = undefined
  }
}
function goToPreviousImage() {
  const prevImageId = resultStore.getPreviousImageId(image.value)
  if (prevImageId) {
    image.value = prevImageId
    primaryImage.value = realImagePath(prevImageId)
    secondaryImage.value = undefined
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
</script>
