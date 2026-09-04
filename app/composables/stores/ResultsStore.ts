import { defineStore } from 'pinia'

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
}

export type ImageResult = {
  exit1: Results
  exit2: Results
  exit3: Results
  exit4: Results
}

export type ImageResults = Record<string, ImageResult>

type RawImageResult = {
  [Exit in typeof exits[number]]: Omit<Results, 'sparsity'> & {
    sparsity?: number
  }
}

type RawImageResults = Record<string, RawImageResult>

const exits = ['exit1', 'exit2', 'exit3', 'exit4'] as const
const metrics = ['time_s', 'mean_IoU', 'pixel_acc', 'mean_acc', 'sparsity'] as const

type storeState = {
  exitMetrics: ExitMetrics
  imageResults: ImageResults
  isLoading: boolean
  loaded: boolean
}

export const useResultStore = defineStore('results', {
  state: (): storeState => ({
    exitMetrics: {
      exit1: { time_s: { min: 0, max: 1, mean: 0.5 }, mean_IoU: { min: 0, max: 1, mean: 0.5 }, pixel_acc: { min: 0, max: 1, mean: 0.5 }, mean_acc: { min: 0, max: 1, mean: 0.5 }, sparsity: { min: 0, max: 1, mean: 0.5 } },
      exit2: { time_s: { min: 0, max: 1, mean: 0.5 }, mean_IoU: { min: 0, max: 1, mean: 0.5 }, pixel_acc: { min: 0, max: 1, mean: 0.5 }, mean_acc: { min: 0, max: 1, mean: 0.5 }, sparsity: { min: 0, max: 1, mean: 0.5 } },
      exit3: { time_s: { min: 0, max: 1, mean: 0.5 }, mean_IoU: { min: 0, max: 1, mean: 0.5 }, pixel_acc: { min: 0, max: 1, mean: 0.5 }, mean_acc: { min: 0, max: 1, mean: 0.5 }, sparsity: { min: 0, max: 1, mean: 0.5 } },
      exit4: { time_s: { min: 0, max: 1, mean: 0.5 }, mean_IoU: { min: 0, max: 1, mean: 0.5 }, pixel_acc: { min: 0, max: 1, mean: 0.5 }, mean_acc: { min: 0, max: 1, mean: 0.5 }, sparsity: { min: 0, max: 1, mean: 0.5 } }
    },
    imageResults: {},
    isLoading: false,
    loaded: false
  }),
  actions: {
    async fetchResults() {
      if (this.loaded || this.isLoading) {
        return
      }

      this.isLoading = true

      try {
        const rawImageResults = await $fetch<RawImageResults>('/data/results.json')
        const imageResults = Object.fromEntries(
          Object.entries(rawImageResults).map(([image, result]) => [
            image,
            Object.fromEntries(
              exits.map(exit => [
                exit,
                {
                  ...result[exit],
                  sparsity: result[exit].sparsity ?? 0
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
    }
  }

})
