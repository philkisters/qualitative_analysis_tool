<template>
  <div
    class="flex-2"
    :class="{ 'border border-slate-300': border }"
  >
    <UChip
      :show="show"
      :color="color"
      :position="position"
    >
      <img
        :src="imagePath"
        alt="Raw Image"
        class=""
      >
    </UChip>
  </div>
</template>

<script lang="ts" setup>
import type { ChipProps } from '@nuxt/ui'

const { show, color, imagePath, border = false } = defineProps<{
  show: boolean
  color: ChipProps['color']
  imagePath: string
  border?: boolean
}>()

const position = computed(() => color === 'primary' ? 'top-left' : 'top-right')
</script>

<style>

</style>
