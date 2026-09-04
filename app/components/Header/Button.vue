<template>
  <UButton
    :icon="icon"
    variant="outline"
    size="xl"
    class="w-24 justify-center"
  />
</template>

<script lang="ts" setup>
const { icon } = defineProps<{ icon: string }>()
</script>
