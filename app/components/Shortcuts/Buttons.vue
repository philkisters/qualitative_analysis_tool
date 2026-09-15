<template>
  <div class="flex-1 flex flex-col gap-2">
    <div class="flex gap-2 justify-stretch">
      <UButton
        block
        color="secondary"
        label="Min mIoU"
        @click="goToImage(minMIOUId)"
      />
      <UButton
        block
        label="Max mIoU"
        @click="goToImage(maxMIOUId)"
      />
    </div>
    <div
      v-if="hasDelta"
      class="flex gap-2 justify-stretch"
    >
      <UButton
        block
        icon="lucide-triangle"
        color="secondary"
        label="Min mIoU"
        @click="goToImage(minDeltaMIOUId)"
      />
      <UButton
        block
        icon="lucide-triangle"
        label="Max mIoU"
        @click="goToImage(maxDeltaMIOUId)"
      />
    </div>
    <div class="flex gap-2 justify-stretch mt-4">
      <UButton
        block
        color="secondary"
        label="Min Runtime"
        @click="goToImage(minTimeId)"
      />
      <UButton
        block
        label="Max Runtime"
        @click="goToImage(maxTimeId)"
      />
    </div>
    <div
      v-if="hasDelta"
      class="flex gap-2 justify-stretch"
    >
      <UButton
        block
        icon="lucide-triangle"
        color="secondary"
        label="Min Runtime"
        @click="goToImage(minDeltaTimeId)"
      />
      <UButton
        block
        icon="lucide-triangle"
        label="Max Runtime"
        @click="goToImage(maxDeltaTimeId)"
      />
    </div>
    <div class="flex gap-2 justify-stretch mt-4">
      <UButton
        block
        color="secondary"
        label="Min Accuracy"
        @click="goToImage(minAccuracyId)"
      />
      <UButton
        block
        label="Max Accuracy"
        @click="goToImage(maxAccuracyId)"
      />
    </div>
    <div
      v-if="hasDelta"
      class="flex gap-2 justify-stretch"
    >
      <UButton
        block
        icon="lucide-triangle"
        color="secondary"
        label="Min Accuracy"
        @click="goToImage(minDeltaAccuracyId)"
      />
      <UButton
        block
        icon="lucide-triangle"
        label="Max Accuracy"
        @click="goToImage(maxDeltaAccuracyId)"
      />
    </div>
    <div class="flex gap-2 justify-stretch mt-4">
      <UButton
        block
        color="secondary"
        label="Min Sparsity"
        @click="goToImage(minSparsityId)"
      />
      <UButton
        block
        label="Max Sparsity"
        @click="goToImage(maxSparsityId)"
      />
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

const minMIOUId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'mean_IoU', 'min'))
const maxMIOUId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'mean_IoU', 'max'))
const minDeltaMIOUId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'delta_mean_IoU', 'min'))
const maxDeltaMIOUId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'delta_mean_IoU', 'max'))

const minTimeId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'time_s', 'min'))
const maxTimeId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'time_s', 'max'))
const minDeltaTimeId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'delta_time_s', 'min'))
const maxDeltaTimeId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'delta_time_s', 'max'))

const minAccuracyId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'pixel_acc', 'min'))
const maxAccuracyId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'pixel_acc', 'max'))
const minDeltaAccuracyId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'delta_pixel_acc', 'min'))
const maxDeltaAccuracyId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'delta_pixel_acc', 'max'))

const minSparsityId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'sparsity', 'min'))
const maxSparsityId = computed(() => resultsStore.getImageIdForMetricValue(exit, 'sparsity', 'max'))

const hasDelta = computed(() => resultsStore.hasDelta())

const goToImage = (imageId: string | null) => {
  if (imageId) {
    emit('navigate', imageId)
  } else {
    toast.add({
      title: 'Something is wrong, please reload',
      color: 'error'
    })
  }
}
</script>
