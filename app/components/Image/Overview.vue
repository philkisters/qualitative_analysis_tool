<template>
  <div class=" flex flex-col gap-2">
    <div class="flex gap-2 items-center">
      <div class="flex-2 text-lg text-right">
        Raw Image
      </div>
      <ImagePreview
        :show="showImage({ type: ImageType.Real, exit: 1 })"
        :color="getColor({ type: ImageType.Real, exit: 1 })"
        :image-path="getImagePath(image, { type: ImageType.Real, exit: 1 }, config)"
        @click="setPrimaryImage({ type: ImageType.Real, exit: 1 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.Real, exit: 1 })"
      />
      <ImagePreview
        :show="showImage({ type: ImageType.GT, exit: 1 })"
        :color="getColor({ type: ImageType.GT, exit: 1 })"
        :image-path="getImagePath(image, { type: ImageType.GT, exit: 1 }, config)"
        @click="setPrimaryImage({ type: ImageType.GT, exit: 1 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.GT, exit: 1 })"
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
      <ImagePreview
        :show="showImage({ type: ImageType.Prediction, exit: 1 })"
        :color="getColor({ type: ImageType.Prediction, exit: 1 })"
        :image-path="getImagePath(image, { type: ImageType.Prediction, exit: 1 }, config)"
        @click="setPrimaryImage({ type: ImageType.Prediction, exit: 1 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.Prediction, exit: 1 })"
      />
      <ImagePreview
        :show="showImage({ type: ImageType.Prediction, exit: 2 })"
        :color="getColor({ type: ImageType.Prediction, exit: 2 })"
        :image-path="getImagePath(image, { type: ImageType.Prediction, exit: 2 }, config)"
        @click="setPrimaryImage({ type: ImageType.Prediction, exit: 2 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.Prediction, exit: 2 })"
      />
      <ImagePreview
        :show="showImage({ type: ImageType.Prediction, exit: 3 })"
        :color="getColor({ type: ImageType.Prediction, exit: 3 })"
        :image-path="getImagePath(image, { type: ImageType.Prediction, exit: 3 }, config)"
        @click="setPrimaryImage({ type: ImageType.Prediction, exit: 3 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.Prediction, exit: 3 })"
      />
      <ImagePreview
        :show="showImage({ type: ImageType.Prediction, exit: 4 })"
        :color="getColor({ type: ImageType.Prediction, exit: 4 })"
        :image-path="getImagePath(image, { type: ImageType.Prediction, exit: 4 }, config)"
        @click="setPrimaryImage({ type: ImageType.Prediction, exit: 4 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.Prediction, exit: 4 })"
      />
    </div>
    <div class="flex gap-2 items-center">
      <div class="flex-2 text-lg text-center">
        Pixel Mask
      </div>
      <div class="flex-1" />
      <ImagePreview
        border
        :show="showImage({ type: ImageType.PixelMask, exit: 2 })"
        :color="getColor({ type: ImageType.PixelMask, exit: 2 })"
        :image-path="getImagePath(image, { type: ImageType.PixelMask, exit: 2 }, config)"
        @click="setPrimaryImage({ type: ImageType.PixelMask, exit: 2 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.PixelMask, exit: 2 })"
      />
      <ImagePreview
        border
        :show="showImage({ type: ImageType.PixelMask, exit: 3 })"
        :color="getColor({ type: ImageType.PixelMask, exit: 3 })"
        :image-path="getImagePath(image, { type: ImageType.PixelMask, exit: 3 }, config)"
        @click="setPrimaryImage({ type: ImageType.PixelMask, exit: 3 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.PixelMask, exit: 3 })"
      />
      <ImagePreview
        border
        :show="showImage({ type: ImageType.PixelMask, exit: 4 })"
        :color="getColor({ type: ImageType.PixelMask, exit: 4 })"
        :image-path="getImagePath(image, { type: ImageType.PixelMask, exit: 4 }, config)"
        @click="setPrimaryImage({ type: ImageType.PixelMask, exit: 4 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.PixelMask, exit: 4 })"
      />
      <div class="flex-1" />
    </div>
    <div class="flex gap-2 items-center">
      <div class="flex-2 text-lg text-center">
        Block Mask
      </div>
      <div class="flex-1" />
      <ImagePreview
        border
        :show="showImage({ type: ImageType.BlockMask, exit: 2 })"
        :color="getColor({ type: ImageType.BlockMask, exit: 2 })"
        :image-path="getImagePath(image, { type: ImageType.BlockMask, exit: 2 }, config)"
        @click="setPrimaryImage({ type: ImageType.BlockMask, exit: 2 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.BlockMask, exit: 2 })"
      />
      <ImagePreview
        :show="showImage({ type: ImageType.BlockMask, exit: 3 })"
        :color="getColor({ type: ImageType.BlockMask, exit: 3 })"
        :image-path="getImagePath(image, { type: ImageType.BlockMask, exit: 3 }, config)"
        border
        @click="setPrimaryImage({ type: ImageType.BlockMask, exit: 3 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.BlockMask, exit: 3 })"
      />
      <ImagePreview
        :show="showImage({ type: ImageType.BlockMask, exit: 4 })"
        :color="getColor({ type: ImageType.BlockMask, exit: 4 })"
        :image-path="getImagePath(image, { type: ImageType.BlockMask, exit: 4 }, config)"
        border
        @click="setPrimaryImage({ type: ImageType.BlockMask, exit: 4 })"
        @contextmenu.prevent="setSecondaryImage({ type: ImageType.BlockMask, exit: 4 })"
      />
      <div class="flex-1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getImagePath } = useImageResolver()
const { image, config } = defineProps<{ image: string, config: Record<string, string> }>()

const primaryImage = defineModel<ImageIdentifier>('primary', { default: () => ({ type: ImageType.Real, exit: 1 }) })
const secondaryImage = defineModel<ImageIdentifier>('secondary', { default: () => ({ type: ImageType.Real, exit: 1 }) })

const showImage = (imageIdentifier: ImageIdentifier): boolean => {
  return compareImageIdentifiers(primaryImage.value, imageIdentifier)
    || compareImageIdentifiers(secondaryImage.value, imageIdentifier)
}

const getColor = (imageIdentifier: ImageIdentifier) => {
  return compareImageIdentifiers(primaryImage.value, imageIdentifier) ? 'primary' : 'secondary'
}

function setPrimaryImage(imageIdentifier: ImageIdentifier) {
  console.log(`Setting primary image to: ${imageIdentifier.type} ${imageIdentifier.exit}`)
  primaryImage.value = imageIdentifier
}

function setSecondaryImage(imageIdentifier: ImageIdentifier) {
  secondaryImage.value = imageIdentifier
}
</script>
