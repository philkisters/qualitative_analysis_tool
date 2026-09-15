import { defineStore } from 'pinia'
import type { PredictionConfig } from '~~/shared/Prediction'

export type MetricValues = {
  min: number
  max: number
  mean: number
}

export type ResultMetrics = {
  time_s: MetricValues
  mean_IoU: MetricValues
  pixel_acc: MetricValues
  mean_acc: MetricValues
  sparsity: MetricValues
  delta_time_s: MetricValues
  delta_mean_IoU: MetricValues
  delta_pixel_acc: MetricValues
  delta_mean_acc: MetricValues
}

export type ExitMetrics = {
  exit1: ResultMetrics
  exit2: ResultMetrics
  exit3: ResultMetrics
  exit4: ResultMetrics
}

export type Results = {
  time_s: number
  mean_IoU: number
  pixel_acc: number
  mean_acc: number
  sparsity: number
  delta_time_s: number
  delta_mean_IoU: number
  delta_pixel_acc: number
  delta_mean_acc: number
}

export type ImageResult = {
  exit1: Results
  exit2: Results
  exit3: Results
  exit4: Results
}

export type ImageResults = Record<string, ImageResult>

type OptionalResultKeys = 'sparsity' | 'delta_time_s' | 'delta_mean_IoU' | 'delta_pixel_acc' | 'delta_mean_acc'

type RawImageResult = {
  [Exit in typeof exits[number]]: Omit<Results, OptionalResultKeys> & {
    [Key in OptionalResultKeys]?: number
  }
}

type RawImageResults = Record<string, RawImageResult>

const exits = ['exit1', 'exit2', 'exit3', 'exit4'] as const
const metrics = ['time_s', 'mean_IoU', 'pixel_acc', 'mean_acc', 'sparsity', 'delta_time_s', 'delta_mean_IoU', 'delta_pixel_acc', 'delta_mean_acc'] as const

export type Metric = typeof metrics[number]

type storeState = {
  exitMetrics: ExitMetrics
  imageResults: ImageResults
  isLoading: boolean
  loaded: boolean
}

export const useResultStore = defineStore('results', {
  state: (): storeState => {
    const defaultResultMetrics = metrics.reduce((resultMetrics, metric) => {
      resultMetrics[metric] = { min: 0, max: 1, mean: 0.5 }
      return resultMetrics
    }, {} as ResultMetrics)

    return {
      exitMetrics: {
        exit1: defaultResultMetrics,
        exit2: defaultResultMetrics,
        exit3: defaultResultMetrics,
        exit4: defaultResultMetrics
      },
      imageResults: {},
      isLoading: false,
      loaded: false
    }
  },
  actions: {
    async fetchResults(config: PredictionConfig, imageid: string) {
      if (this.isLoading) {
        return
      }

      this.isLoading = true
      this.loaded = false

      try {
        const rawImageResults = await $fetch<RawImageResults>(`/api/results/${imageid}`, {
          query: {
            device: config.device,
            kernel: config.kernel,
            startStage: config.startStage,
            branches: config.branches,
            threshold: config.threshold
          }
        })
        const imageResults = Object.fromEntries(
          Object.entries(rawImageResults).map(([image, result]) => [
            image,
            Object.fromEntries(
              exits.map(exit => [
                exit,
                {
                  ...result[exit],
                  sparsity: result[exit].sparsity ?? 0,
                  delta_time_s: result[exit].delta_time_s ?? 0,
                  delta_mean_IoU: result[exit].delta_mean_IoU ?? 0,
                  delta_pixel_acc: result[exit].delta_pixel_acc ?? 0,
                  delta_mean_acc: result[exit].delta_mean_acc ?? 0
                }
              ])
            )
          ])
        ) as ImageResults

        this.imageResults = imageResults
        this.exitMetrics = exits.reduce((exitMetrics, exit) => {
          exitMetrics[exit] = metrics.reduce((resultMetrics, metric) => {
            const values = Object.values(imageResults)
              .map(result => result[exit][metric])
              .filter((value): value is number => typeof value === 'number')

            if (values.length === 0) {
              resultMetrics[metric] = { min: 0, max: 1, mean: 0.5 }
              return resultMetrics
            }

            resultMetrics[metric] = {
              min: Math.min(...values),
              max: Math.max(...values),
              mean: values.reduce((sum, value) => sum + value, 0) / values.length
            }
            return resultMetrics
          }, {} as ResultMetrics)
          return exitMetrics
        }, {} as ExitMetrics)
        this.loaded = true
      } finally {
        this.isLoading = false
      }
    }
  },
  getters: {
    getNextImageId: state => (currentImageId: string) => {
      const imageIds = Object.keys(state.imageResults)
      const currentIndex = imageIds.indexOf(currentImageId)
      if (currentIndex === -1) {
        return null
      }
      return imageIds[(currentIndex + 1) % imageIds.length]
    },
    getPreviousImageId: state => (currentImageId: string) => {
      const imageIds = Object.keys(state.imageResults)
      const currentIndex = imageIds.indexOf(currentImageId)
      if (currentIndex < 0) {
        return null
      }
      return imageIds[(currentIndex - 1) < 0 ? imageIds.length - 1 : currentIndex - 1]
    },
    hasDelta: state => () => {
      const imageIds = Object.keys(state.imageResults)
      for (const imageId of imageIds) {
        const exits = Object.keys(state.imageResults[imageId]!) as ('exit1' | 'exit2' | 'exit3' | 'exit4')[]
        for (const exit of exits) {
          const metrics = Object.keys(state.imageResults[imageId]![exit]) as Metric[]
          for (const metric of metrics) {
            if (metric.startsWith('delta_')) {
              const value = state.imageResults[imageId]![exit][metric]
              if (typeof value === 'number' && value !== 0) {
                return true
              }
            }
          }
        }
      }
      return false
    },
    getImageIdForMetricValue(state) {
      return (exit: 'exit1' | 'exit2' | 'exit3' | 'exit4', metric: Metric, target: 'min' | 'max') => {
        if (metric.startsWith('delta_') && !this.hasDelta()) {
          return null
        }
        const imageIds = Object.keys(state.imageResults)
        let targetImageId: string | null = null
        let targetValue: number | null = null

        for (const imageId of imageIds) {
          const value = state.imageResults[imageId]![exit][metric]
          if (typeof value !== 'number') continue
          if (targetValue === null || (target === 'min' ? value < targetValue : value > targetValue)) {
            targetValue = value
            targetImageId = imageId
          }
        }

        return targetImageId
      }
    }
  }
})
