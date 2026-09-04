<template>
  <UApp class="">
    <div
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
          <HeaderButton icon="i-lucide-move-left" />
          <HeaderTitle title="Configuration" />
          <HeaderButton icon="i-lucide-move-right" />
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
              :show="showImage(`/data/${image}/leftImg8bit.png`)"
              :color="getColor(`/data/${image}/leftImg8bit.png`)"
              :image-path="`/data/${image}/leftImg8bit.png`"
              @click="setPrimaryImage(`/data/${image}/leftImg8bit.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/leftImg8bit.png`)"
            />
            <PreviewImage
              :show="showImage(`/data/${image}/gtFine_color.png`)"
              :color="getColor(`/data/${image}/gtFine_color.png`)"
              :image-path="`/data/${image}/gtFine_color.png`"
              @click="setPrimaryImage(`/data/${image}/gtFine_color.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/gtFine_color.png`)"
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
              :show="showImage(`/data/${image}/exit1_prediction.png`)"
              :color="getColor(`/data/${image}/exit1_prediction.png`)"
              :image-path="`/data/${image}/exit1_prediction.png`"
              @click="setPrimaryImage(`/data/${image}/exit1_prediction.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit1_prediction.png`)"
            />
            <PreviewImage
              :show="showImage(`/data/${image}/exit2_prediction.png`)"
              :color="getColor(`/data/${image}/exit2_prediction.png`)"
              :image-path="`/data/${image}/exit2_prediction.png`"
              @click="setPrimaryImage(`/data/${image}/exit2_prediction.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit2_prediction.png`)"
            />
            <PreviewImage
              :show="showImage(`/data/${image}/exit3_prediction.png`)"
              :color="getColor(`/data/${image}/exit3_prediction.png`)"
              :image-path="`/data/${image}/exit3_prediction.png`"
              @click="setPrimaryImage(`/data/${image}/exit3_prediction.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit3_prediction.png`)"
            />
            <PreviewImage
              :show="showImage(`/data/${image}/exit4_prediction.png`)"
              :color="getColor(`/data/${image}/exit4_prediction.png`)"
              :image-path="`/data/${image}/exit4_prediction.png`"
              @click="setPrimaryImage(`/data/${image}/exit4_prediction.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit4_prediction.png`)"
            />
          </div>
          <div class="flex gap-2 items-center">
            <div class="flex-2 text-lg text-center">
              Pixel Mask
            </div>
            <div class="flex-1" />
            <PreviewImage
              border
              :show="showImage(`/data/${image}/exit2_pixel_mask.png`)"
              :color="getColor(`/data/${image}/exit2_pixel_mask.png`)"
              :image-path="`/data/${image}/exit2_pixel_mask.png`"
              @click="setPrimaryImage(`/data/${image}/exit2_pixel_mask.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit2_pixel_mask.png`)"
            />
            <PreviewImage
              border
              :show="showImage(`/data/${image}/exit3_pixel_mask.png`)"
              :color="getColor(`/data/${image}/exit3_pixel_mask.png`)"
              :image-path="`/data/${image}/exit3_pixel_mask.png`"
              @click="setPrimaryImage(`/data/${image}/exit3_pixel_mask.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit3_pixel_mask.png`)"
            />
            <PreviewImage
              border
              :show="showImage(`/data/${image}/exit4_pixel_mask.png`)"
              :color="getColor(`/data/${image}/exit4_pixel_mask.png`)"
              :image-path="`/data/${image}/exit4_pixel_mask.png`"
              @click="setPrimaryImage(`/data/${image}/exit4_pixel_mask.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit4_pixel_mask.png`)"
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
              :show="showImage(`/data/${image}/exit2_block_mask.png`)"
              :color="getColor(`/data/${image}/exit2_block_mask.png`)"
              :image-path="`/data/${image}/exit2_block_mask.png`"
              @click="setPrimaryImage(`/data/${image}/exit2_block_mask.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit2_block_mask.png`)"
            />
            <PreviewImage
              :show="showImage(`/data/${image}/exit3_block_mask.png`)"
              :color="getColor(`/data/${image}/exit3_block_mask.png`)"
              :image-path="`/data/${image}/exit3_block_mask.png`"
              border
              @click="setPrimaryImage(`/data/${image}/exit3_block_mask.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit3_block_mask.png`)"
            />
            <PreviewImage
              :show="showImage(`/data/${image}/exit4_block_mask.png`)"
              :color="getColor(`/data/${image}/exit4_block_mask.png`)"
              :image-path="`/data/${image}/exit4_block_mask.png`"
              border
              @click="setPrimaryImage(`/data/${image}/exit4_block_mask.png`)"
              @contextmenu.prevent="setSecondaryImage(`/data/${image}/exit4_block_mask.png`)"
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

const resultStore = useResultStore()
onMounted(() => resultStore.fetchResults())

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
const image = ref(typeof route.query.img === 'string' ? route.query.img : 'frankfurt_000000_000576')
const primaryImage = ref(`/data/${image.value}/leftImg8bit.png`)
const secondaryImage = ref<string | undefined>(undefined)
const alpha = ref([0.5])

const showImage = (imagePath: string) => {
  return primaryImage.value === imagePath || secondaryImage.value === imagePath
}
const getColor = (imagePath: string) => {
  return primaryImage.value === imagePath ? 'primary' : 'secondary'
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
    primaryImage.value = `/data/${nextImageId}/leftImg8bit.png`
    secondaryImage.value = undefined
  }
}
function goToPreviousImage() {
  const prevImageId = resultStore.getPreviousImageId(image.value)
  if (prevImageId) {
    image.value = prevImageId
    primaryImage.value = `/data/${prevImageId}/leftImg8bit.png`
    secondaryImage.value = undefined
  }
}
</script>
