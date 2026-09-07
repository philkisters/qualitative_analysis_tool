import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  // Get results base path from environment
  const resultsPath = process.env.NUXT_RESULTS_PATH || '/scratch/qual-results'

  // Build the full path to configs.json
  const configsFilePath = path.join(resultsPath, 'configs.json')

  // Read and return the configs file
  try {
    const configsBuffer = await fs.promises.readFile(configsFilePath)
    const configs = JSON.parse(configsBuffer.toString())
    setHeader(event, 'Content-Type', 'application/json')
    return configs
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Configs file not found',
      data: { path: configsFilePath, error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
})
