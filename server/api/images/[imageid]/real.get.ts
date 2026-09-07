import { getRealImage } from '~~/shared/Prediction'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  const { imageid } = getRouterParams(event)

  if (!imageid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image ID is required'
    })
  }

  // Get dataset base path from environment
  const datasetPath = process.env.NUXT_DATASET_PATH || '/scratch/datasets/cityscapes'

  // Build the full path to real image
  const realImagePath = getRealImage(imageid)
  const fullPath = path.join(datasetPath, realImagePath)

  // Read and return the image
  try {
    const imageBuffer = await fs.promises.readFile(fullPath)
    setHeader(event, 'Content-Type', 'image/png')
    return imageBuffer
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Real image not found',
      data: { path: fullPath, error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
})