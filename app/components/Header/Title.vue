<template>
  <div class="text-xl font-bold content-center">
    {{ title }}
  </div>
</template>

<script lang="ts" setup>
const { title } = defineProps<{ title: string }>()
</script>
