import { type TrainingSession, trainingSessionSchema } from 'schema/training.ts'
import {
  fetchAndParseCSV,
  replaceHeaders,
  trainingURL,
  transformClimbingData,
  TRANSFORMED_TRAINING_HEADER_NAMES,
} from 'scripts/import-training-and-ascent-data-from-gs.ts'

import { createCache } from 'helpers/cache.ts'

const { getCache, setCache } = createCache<TrainingSession[]>()

export async function getTrainingSessions(): Promise<TrainingSession[]> {
  const cachedData = getCache()
  if (cachedData !== undefined) {
    return cachedData
  }

  // Fetch CSV data
  const { data, headers } = await fetchAndParseCSV(trainingURL)
  // Transform CSV data into Array of Trs
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
