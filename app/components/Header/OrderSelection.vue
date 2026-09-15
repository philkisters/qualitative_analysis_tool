<template>
  <USelect
    v-model="order"
    :items="items"
    color="primary"
    size="xl"
    highlight
  />
</template>

<script lang="ts" setup>
import type { Metric } from '~/composables/stores/ResultsStore'


const emit = defineEmits<{
  (e: 'update:order', order: ('id' | Metric)): void
}>()

const order = ref<('id' | Metric)>('id')
const items = ref<(Metric | 'id')[]>(['id', 'time_s', 'mean_IoU', 'pixel_acc', 'mean_acc', 'sparsity', 'delta_time_s', 'delta_mean_IoU', 'delta_pixel_acc', 'delta_mean_acc'])

watch(order, (newValue: 'id' | Metric) => {
  emit('update:order', newValue)
})

</script>