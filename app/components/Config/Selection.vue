<template>
  <div class="flex flex-col w-full">
    <div class="flex border-2 border-primary/60 w-full">
      <div class="flex-1 flex flex-col border-r-2 border-primary/60 bg-muted">
        <div class="text-lg font-bold p-2 border border-primary/60 text-center">
          Device
        </div>
        <div class="text-lg font-bold p-2 border border-primary/60 text-center">
          Kernel
        </div>
        <div class="text-lg font-bold p-2 border border-primary/60 text-center">
          Start Stage
        </div>
        <div class="text-lg font-bold p-2 border border-primary/60 text-center">
          Masked Branches
        </div>
        <div class="text-lg font-bold p-2 border border-primary/60 text-center">
          Threshold
        </div>
      </div>
      <div class="flex-3 flex flex-col">
        <div class="flex w-full">
          <ConfigSelectionItem
            :status="optionStatus('device', 'jetson')"
            @click="selectOption('device', 'jetson')"
          >
            Jetson
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('device', 'gpu02')"
            @click="selectOption('device', 'gpu02')"
          >
            GPU 02
          </ConfigSelectionItem>
        </div>
        <div class="flex w-full">
          <ConfigSelectionItem
            :status="optionStatus('kernel', 'block')"
            @click="selectOption('kernel', 'block')"
          >
            Block
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('kernel', 'custom')"
            @click="selectOption('kernel', 'custom')"
          >
            Custom
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('kernel', 'torch')"
            @click="selectOption('kernel', 'torch')"
          >
            Torch
          </ConfigSelectionItem>
        </div>
        <div class="flex w-full">
          <ConfigSelectionItem
            :status="optionStatus('startStage', 1)"
            @click="selectOption('startStage', 1)"
          >
            1
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('startStage', 2)"
            @click="selectOption('startStage', 2)"
          >
            2
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('startStage', 3)"
            @click="selectOption('startStage', 3)"
          >
            3
          </ConfigSelectionItem>
        </div>
        <div class="flex w-full">
          <ConfigSelectionItem
            :status="optionStatus('branches', 0)"
            @click="selectOption('branches', 0)"
          >
            [0]
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('branches', 1)"
            @click="selectOption('branches', 1)"
          >
            [0, 1]
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('branches', 2)"
            @click="selectOption('branches', 2)"
          >
            [0, 1, 2]
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('branches', 3)"
            @click="selectOption('branches', 3)"
          >
            [0, 1, 2, 3]
          </ConfigSelectionItem>
        </div>
        <div class="flex w-full">
          <ConfigSelectionItem
            :status="optionStatus('threshold', 1)"
            @click="selectOption('threshold', 1)"
          >
            0.1
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('threshold', 2)"
            @click="selectOption('threshold', 2)"
          >
            0.2
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('threshold', 3)"
            @click="selectOption('threshold', 3)"
          >
            0.3
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('threshold', 4)"
            @click="selectOption('threshold', 4)"
          >
            0.4
          </ConfigSelectionItem>
          <ConfigSelectionItem
            :status="optionStatus('threshold', 5)"
            @click="selectOption('threshold', 5)"
          >
            0.5
          </ConfigSelectionItem>
        </div>
      </div>
    </div>
    <UButton
      class="mt-4 justify-center text-xl mx-4"
      :disabled="!selectionComplete"
      :color="selectionComplete ? 'primary' : 'warning'"
      :variant="selectionComplete ? 'solid' : 'outline'"
      @click="confirmSelection"
    >
      Confirm
    </UButton>
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from '~/composables/stores/ConfigStore'
import type { PredictionConfig } from '~~/shared/Prediction'

const configStore = useConfigStore()

const emit = defineEmits<{
  (e: 'confirm', configIndex: number): void
}>()

const levelOrder: (keyof PredictionConfig)[] = ['device', 'kernel', 'startStage', 'branches', 'threshold']
const selection = reactive<Partial<PredictionConfig>>({})

const nextLevelIndex = computed(() =>
  levelOrder.findIndex(level => selection[level] === undefined)
)

const selectionComplete = computed(() =>
  nextLevelIndex.value === -1
)

function selectionsAbove(level: keyof PredictionConfig): Partial<PredictionConfig> {
  const idx = levelOrder.indexOf(level)
  const result: Record<string, unknown> = {}
  for (let i = 0; i < idx; i++) {
    const key = levelOrder[i]!
    result[key] = selection[key]
  }
  return result as Partial<PredictionConfig>
}

function availableOptions(level: keyof PredictionConfig) {
  return configStore.getAvailableOptions(level, selectionsAbove(level))
}

function optionStatus(level: keyof PredictionConfig, value: unknown): 'active' | 'enabled' | 'disabled' {
  const idx = levelOrder.indexOf(level)
  if (idx > nextLevelIndex.value && nextLevelIndex.value !== -1) return 'disabled' // future level not reachable yet
  if (selection[level] === value) return 'active'
  if (idx === nextLevelIndex.value || idx < nextLevelIndex.value) {
    // level already resolved or is the current one to pick -> check availability
    if ((availableOptions(level) as unknown[]).includes(value)) return 'enabled'
  }
  return 'disabled'
}

function selectOption(level: keyof PredictionConfig, value: unknown) {
  const status = optionStatus(level, value)
  if (status === 'disabled') return
  const idx = levelOrder.indexOf(level)
  // clicking the active option again deselects it (and everything after it)
  const isDeselect = status === 'active'
  levelOrder.forEach((l, i) => {
    if (i < idx) return
    if (i === idx && !isDeselect) (selection as Record<string, unknown>)[l] = value
    else selection[l] = undefined
  })
}

function confirmSelection() {
  if (!selectionComplete.value) return
  const configIndex = configStore.getIndexForConfig(selection)
  if (configIndex === -1) return
  emit('confirm', configIndex)
}
</script>
