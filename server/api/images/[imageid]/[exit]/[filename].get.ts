import { getPredictionPath, getPredictionConfigFromQuery } from '~~/shared/Prediction'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  const { imageid, exit, filename } = getRouterParams(event)
  const query = getQuery(event)

  if (!imageid || !exit || !filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image ID, exit, and filename are required'
    })
  }

  const exitNumber = Number(exit)
  if (isNaN(exitNumber) || exitNumber < 1 || exitNumber > 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Exit must be a number between 1 and 4'
    })
  }

  const config = getPredictionConfigFromQuery(query)

  // Get base path from environment
  const resultsPath = process.env.NUXT_RESULTS_PATH || '/scratch/qual-results'

  // Build the full path
  const predictionPath = getPredictionPath(config)
  const imageFileName = `exit${exitNumber}_${filename}.png`

  const fullPath = path.join(resultsPath, predictionPath, imageid, imageFileName)

  // Read and return the image
  try {
    const imageBuffer = await fs.promises.readFile(fullPath)
    setHeader(event, 'Content-Type', 'image/png')
    return imageBuffer
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Image not found',
      data: { path: fullPath, error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
})
