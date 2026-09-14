<template>
  <div class="flex flex-col gap-2">
    <div class="text-lg text-center">
      Shortcuts
    </div>
    <USeparator color="primary" />
    <div class="flex gap-2 justify-center">
      <div class="italic text-lg text-muted text-center">
        Use the shortcuts below to quickly navigate to images with extreme metric values.
      </div>
    </div>
    <div class="flex w-full h-full items-center justify-center gap-4">
      <div class="flex-1 flex flex-col gap-2">
        <div class="font-bold text-xl text-center">
          Exit 2
        </div>
        <ShortcutsButtons exit="exit2" @navigate="emit('navigate', $event)"/>
      </div>
      <div class="flex-1 flex flex-col gap-2">
        <div class="font-bold text-xl text-center">
          Exit 3
        </div>
        <ShortcutsButtons exit="exit3" @navigate="emit('navigate', $event)"/>
      </div>
      <div class="flex-1 flex flex-col gap-2">
        <div class="font-bold text-xl text-center">
          Exit 4
        </div>
        <ShortcutsButtons exit="exit4" @navigate="emit('navigate', $event)"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'navigate', imageId: string): void
}>()
</script>
