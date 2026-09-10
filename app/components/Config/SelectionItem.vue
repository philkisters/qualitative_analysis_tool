<template>
  <div
    class="flex-1 text-lg text-center p-2 border border-primary/30 select-none"
    :class="{
      'bg-primary/70 text-inverted cursor-pointer': status === 'active',
      'bg-secondary/30 text-secondary cursor-pointer hover:bg-secondary/50': status === 'enabled',
      'bg-muted text-muted cursor-not-allowed': status === 'disabled'
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ status: 'active' | 'enabled' | 'disabled' }>()
</script>
