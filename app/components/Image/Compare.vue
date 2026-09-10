<template>
  <div class="flex gap-2 items-stretch">
    <div class="w-6">
      <USlider
        v-if="compareActive"
        v-model="alpha"
        :min="0"
        :max="1"
        :step="0.01"
        orientation="vertical"
      />
    </div>
    <div class="relative flex-1">
      <img
        :src="baseImage"
        alt="Base image"
        class="block h-auto w-full"
      >
      <img
        v-if="compareActive"
        :src="overlayImage"
        alt="Overlay image"
        class="absolute inset-0 h-full w-full object-contain"
        :style="{ opacity: alphaValue }"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
const { baseImage, overlayImage = '' } = defineProps<{
  baseImage: string
  overlayImage?: string
}>()

const alpha = defineModel<number[]>('alpha', { default: () => [0.5] })
const alphaValue = computed(() => alpha.value[0])
const compareActive = computed(() => overlayImage !== baseImage)
</script>
