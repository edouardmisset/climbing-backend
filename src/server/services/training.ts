import { type TrainingSession, trainingSessionSchema } from 'schema/training.ts'
import {
  fetchAndParseCSV,
  replaceHeaders,
  transformClimbingData,
} from 'scripts/import-training-and-ascent-data-from-gs.ts'

import { createCache } from 'helpers/cache.ts'
import { TRANSFORMED_TRAINING_HEADER_NAMES } from 'helpers/transformers.ts'
import { SHEETS_INFO } from 'services/google-sheets.ts'

const { getCache, setCache } = createCache<TrainingSession[]>()

export async function getAllTrainingSessions(): Promise<TrainingSession[]> {
  const cachedData = getCache()
  if (cachedData !== undefined) {
    return cachedData
  }

  // Fetch CSV data
  const { data, headers } = await fetchAndParseCSV(
    SHEETS_INFO.training.csvExportURL,
  )
  // Transform CSV data into Array of Training Sessions
  const transformedHeaders = replaceHeaders(
    headers,
    TRANSFORMED_TRAINING_HEADER_NAMES,
  )

  const transformedClimbingData = transformClimbingData(
    data,
    transformedHeaders,
  )

  try {
    const parsedData = trainingSessionSchema.array().parse(
      transformedClimbingData,
    )
    // Cache the transformed data
    setCache(parsedData)
    return parsedData
  } catch (error) {
    throw new Error('The data could not be parsed', error as Error)
  }
}
