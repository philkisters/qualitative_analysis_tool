export interface PredictionConfig {
  device: 'jetson' | 'gpu02'
  kernel: 'block' | 'custom' | 'torch'
  startStage: '1' | '2' | '3'
  branches: '0' | '1' | '2' | '3'
  threshold: '1' | '2' | '3' | '4' | '5'
}

export function createPath(config: PredictionConfig): string {
  return `${config.device}/${config.kernel}/${config.startStage}/${config.branches}/${config.threshold}`
}
