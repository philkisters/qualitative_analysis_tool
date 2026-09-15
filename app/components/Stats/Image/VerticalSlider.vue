<template>
  <div class="flex-1 flex flex-col gap-2 h-full">
    <div
      v-if="resultStore.loaded"
      class="text-center"
    >
      <UIcon
        v-if="delta"
        name="lucide-triangle"
      />
      {{ title }}
    </div>
    <USkeleton
      v-else
      class="h-4 w-full p-2"
    />
    <ValueSlider
      class="flex-1"
      :metric="metric"
      :value="current"
    />
  </div>
</template>

<script lang="ts" setup>
import { useResultStore, type MetricValues } from '~/composables/stores/ResultsStore'

const resultStore = useResultStore()

const { title, metric, current, delta = false } = defineProps<{ title: string, metric: MetricValues, current: number, delta?: boolean }>()
</script>
