<template>
  <div class="flex-1 text-lg text-center p-2 border select-none"
    :class="{
      'bg-primary text-white cursor-pointer': status === 'active',
      'bg-green-100 cursor-pointer hover:bg-green-200': status === 'enabled',
      'bg-red-100 cursor-not-allowed text-gray-400': status === 'disabled'
    }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ status: 'active' | 'enabled' | 'disabled' }>()
</script>