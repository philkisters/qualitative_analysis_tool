import { getPredictionPath, getPredictionConfigFromQuery } from '~~/shared/Prediction'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  const { imageid } = getRouterParams(event)
  const query = getQuery(event)

  if (!imageid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image ID is required'
    })
  }

  const config = getPredictionConfigFromQuery(query)
  // Get base path from environment
  const resultsPath = process.env.NUXT_RESULTS_PATH || '/scratch/qual-results'

  // Build the full path
  const predictionPath = getPredictionPath(config)
  const resultsFileName = `results.json`
  const fullResultsPath = `${resultsPath}/${predictionPath}/${resultsFileName}`

  try {
    const configsBuffer = await fs.promises.readFile(fullResultsPath)
    const configs = JSON.parse(configsBuffer.toString())
    setHeader(event, 'Content-Type', 'application/json')
    return configs
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Configs file not found',
      data: { path: fullResultsPath, error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
})
