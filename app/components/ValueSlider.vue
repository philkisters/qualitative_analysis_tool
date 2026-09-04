<template>
  <div class="relative flex h-full w-full min-h-0 min-w-0 items-stretch gap-2">
    <div class="relative h-full w-5 shrink-0">
      <div class="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 rounded-full bg-slate-200" />
      <div
        class="absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 ring-2 ring-white transition-[top] duration-1000 ease-out"
        :style="{ top: `${meanPosition}%` }"
      />
      <div
        class="absolute left-0 w-full border-t-2 border-primary transition-[top] duration-1000 ease-out"
        :style="{ top: `${valuePosition}%` }"
      />
    </div>

    <div class="relative min-w-0 flex-1 text-xs tabular-nums">
      <template v-if="resultStore.loaded">
        <span class="absolute inset-x-0 top-0 truncate">{{ metric.max.toFixed(3) }}</span>
        <span
          class="absolute inset-x-0 truncate text-primary transition-[top,transform] duration-1000 ease-out"
          :class="valuePosition <= 4 ? 'translate-y-0' : '-translate-y-1/2'"
          :style="{ top: `${valuePosition}%` }"
        >
          {{ value.toFixed(3) }}
        </span>
        <span class="absolute inset-x-0 bottom-0 truncate">{{ metric.min.toFixed(3) }}</span>
      </template>
      <template v-else>
        <USkeleton class="absolute inset-x-0 top-0 h-4" />
        <USkeleton class="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2" />
        <USkeleton class="absolute inset-x-0 bottom-0 h-4" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResultStore, type MetricValues } from '~/composables/stores/ResultsStore'

const { metric, value } = defineProps<{
  metric: MetricValues
  value: number
}>()

const resultStore = useResultStore()

const valuePosition = computed(() => {
  const range = metric.max - metric.min

  if (range <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, ((metric.max - value) / range) * 100))
})

const meanPosition = computed(() => {
  const range = metric.max - metric.min

  if (range <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, ((metric.max - metric.mean) / range) * 100))
})
</script>
