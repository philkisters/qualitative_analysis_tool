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
      <div class="text-center text-xl font-bold">
        Statistics
      </div>
      <div class="flex gap-4 h-full">
        <div class="flex-2 flex flex-col gap-2">
          <div class="text-lg text-center">
            Image statistics
          </div>
          <USeparator color="primary" />
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
        <USeparator color="primary" orientation="vertical" />
        <div class="flex-2 flex flex-col gap-2">
          <div class="text-lg text-center">
            Class statistics
          </div>
          <USeparator color="primary" />
          <div class="flex w-full h-full items-center justify-center">
            <div class="text-muted italic text-3xl">
              Coming soon...
              <UIcon
                name="mdi:trademark"
                class="animate-spin"
              />
            </div>
          </div>
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
      sparsity: 0
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
</script>
