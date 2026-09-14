<template>
  <div class="flex-1 flex flex-col gap-2">
    <div class="flex gap-2 justify-stretch">
      <UButton block color="secondary" label="Min mIoU" @click="goToImage('min', 'mean_IoU')" />
      <UButton block label="Max mIoU" @click="goToImage('max', 'mean_IoU')" />
    </div>
    <div class="flex gap-2 justify-stretch">
      <UButton block color="secondary" label="Min Runtime" @click="goToImage('min', 'time_s')" />
      <UButton block label="Max Runtime" @click="goToImage('max', 'time_s')" />
    </div>
    <div class="flex gap-2 justify-stretch">
      <UButton block color="secondary" label="Min Sparsity" @click="goToImage('min', 'sparsity')" />
      <UButton block label="Max Sparsity" @click="goToImage('max', 'sparsity')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResultStore } from '../../composables/stores/ResultsStore'

const { exit } = defineProps<{ exit: 'exit1' | 'exit2' | 'exit3' | 'exit4' }>()
const emit = defineEmits<{
  (e: 'navigate', imageId: string): void
}>()

const resultsStore = useResultStore()
const toast = useToast()


const goToImage = (target: 'min' | 'max', metric: 'time_s' | 'mean_IoU' | 'pixel_acc' | 'mean_acc' | 'sparsity') => {
  const imageId = resultsStore.getImageIdForMetricValue(exit, metric, target)
  if (imageId) {
    emit('navigate', imageId)
  } else {
    toast.add({
      title: 'Something is wrong, please reload',
      description: `No image found for ${target} ${metric} in ${exit}.`,
      color: 'error'
    })
  }
}
</script>
