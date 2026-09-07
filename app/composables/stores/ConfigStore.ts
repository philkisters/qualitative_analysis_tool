import type { PredictionConfig } from '~~/shared/Prediction'


type storeState = {
  isLoading: boolean
  isLoaded: boolean
  configs: PredictionConfig[]
}

export const useConfigStore = defineStore('configs', {
  state: (): storeState => {
    return {
      isLoading: false,
      isLoaded: false,
      configs: [] as PredictionConfig[]
    }
  },
  getters: {
    getConfig: (state) => (index: number) => state.configs[index],
    getAvailableOptions: (state) => (
      level: keyof PredictionConfig,
      selections: Partial<PredictionConfig>
    ) => {
      const matching = state.configs.filter(config =>
        (Object.keys(selections) as (keyof PredictionConfig)[]).every(
          key => selections[key] === undefined || config[key] === selections[key]
        )
      )
      const values = matching.map(config => config[level])
      return Array.from(new Set(values))
    },
    getIndexForConfig: (state) => (config: Partial<PredictionConfig>) => {
      return state.configs.findIndex(c =>
        (Object.keys(config) as (keyof PredictionConfig)[]).every(
          key => config[key] === undefined || c[key] === config[key]
        )
      )
    }
  },
  actions: {
    async loadConfigs() {
      this.isLoading = true
      this.isLoaded = false
      fetch('/api/configs')
        .then(response => response.json())
        .then(data => {
          this.configs = data as PredictionConfig[]
          this.isLoaded = true
        })
        .catch(error => {
          console.error('Failed to load configs:', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
})
