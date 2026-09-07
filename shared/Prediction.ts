export interface PredictionConfig {
  device: 'jetson' | 'gpu02'
  kernel: 'block' | 'custom' | 'torch'
  startStage: 1 | 2 | 3
  branches: 0 | 1 | 2 | 3
  threshold: 1 | 2 | 3 | 4 | 5
}

export function getPredictionPath(config: PredictionConfig): string {
  return `${config.device}/${config.kernel}/${config.startStage}/${config.branches}/${config.threshold}`
}

export function getGroundTruthImage(imageId: string): string {
  const city = imageId.split('_')[0]
  return `gtFine/val/${city}/${imageId}_gtFine_color.png`
}

export function getRealImage(imageId: string): string {
  const city = imageId.split('_')[0]
  return `leftImg8bit/val/${city}/${imageId}_leftImg8bit.png`
}

export function getPredictionConfigFromQuery(query: Record<string, any>): PredictionConfig {
  if (!query.device || !query.kernel || !query.startStage || !query.branches || !query.threshold) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All query parameters (device, kernel, startStage, branches, threshold) are required'
    })
  }

  if (query.device !== 'jetson' && query.device !== 'gpu02') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device must be either "jetson" or "gpu02"'
    })
  }

  if (query.kernel !== 'block' && query.kernel !== 'custom' && query.kernel !== 'torch') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kernel must be either "block", "custom", or "torch"'
    })
  }

  const startStage = Number(query.startStage)
  if (isNaN(startStage) || ![1, 2, 3].includes(startStage)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Start stage must be one of 1, 2, or 3'
    })
  }

  const branches = Number(query.branches)
  if (isNaN(branches) || ![0, 1, 2, 3].includes(branches)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Branches must be one of 0, 1, 2, or 3'
    })
  }

  const threshold = Number(query.threshold)
  if (isNaN(threshold) || ![1, 2, 3, 4, 5].includes(threshold)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Threshold must be one of 1, 2, 3, 4, or 5'
    })
  }

  return {
    device: query.device as 'jetson' | 'gpu02',
    kernel: query.kernel as 'block' | 'custom' | 'torch',
    startStage: startStage as 1 | 2 | 3,
    branches: branches as 0 | 1 | 2 | 3,
    threshold: threshold as 1 | 2 | 3 | 4 | 5
  }
}