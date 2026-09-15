<template>
  <div class="flex flex-col gap-2 border border-slate-300 p-2">
    <div class="text-center text-lg font-bold">
      {{ title }}
    </div>
    <div class="flex h-full gap-2">
      <StatsImageVerticalSlider
        title="mIoU"
        :metric="metrics.mean_IoU"
        :current="imageResults.mean_IoU"
      />
      <StatsImageVerticalSlider
        title="Pixel Accuracy"
        :metric="metrics.pixel_acc"
        :current="imageResults.pixel_acc"
      />
      <StatsImageVerticalSlider
        title="Runtime (s)"
        :metric="metrics.time_s"
        :current="imageResults.time_s"
      />
      <StatsImageVerticalSlider
        v-if="!resultStore.loaded || (imageResults.sparsity > 0)"
        title="Sparsity"
        :metric="metrics.sparsity"
        :current="imageResults.sparsity"
      />
    </div>
    <div v-if="hasDelta" class="flex h-full gap-2">
      <StatsImageVerticalSlider
        title="mIoU"
        delta
        :metric="metrics.delta_mean_IoU"
        :current="imageResults.delta_mean_IoU"
      />
      <StatsImageVerticalSlider
        title="Pixel Accuracy"
        delta
        :metric="metrics.delta_pixel_acc"
        :current="imageResults.delta_pixel_acc"
      />
      <StatsImageVerticalSlider
        title="Runtime (s)"
        delta
        :metric="metrics.delta_time_s"
        :current="imageResults.delta_time_s"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResultStore, type ResultMetrics, type Results } from '~/composables/stores/ResultsStore'

const { title, metrics, imageResults } = defineProps<{ title: string, metrics: ResultMetrics, imageResults: Results }>()

const resultStore = useResultStore()

const hasDelta = computed(() => resultStore.hasDelta())
</script>
