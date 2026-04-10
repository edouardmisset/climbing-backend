import { type TrainingSession, trainingSessionSchema } from 'schema/training.ts'
import { createCache } from 'helpers/cache.ts'
import {
  fetchAndParseCSV,
  replaceHeaders,
  transformClimbingData,
} from 'scripts/import-trainings-and-ascents-from-gs.ts'
import { TRANSFORMED_TRAINING_HEADER_NAMES } from 'helpers/transformers.ts'
import { SHEETS_INFO } from './google-sheets.ts'
import { sampleTrainingSessions } from 'backup/samples.ts'

/**
 * Fetch training sessions from Google Sheets
 */
async function fetchTrainingFromGoogleSheets(): Promise<TrainingSession[]> {
  const { data, headers } = await fetchAndParseCSV(
    SHEETS_INFO.training.csvExportURL,
  )

  const transformedHeaders = replaceHeaders(
    headers,
    TRANSFORMED_TRAINING_HEADER_NAMES,
  )

  const transformedClimbingData = transformClimbingData(
    data,
    transformedHeaders,
  )

  try {
    return trainingSessionSchema.array().parse(transformedClimbingData)
  } catch (error) {
    throw new Error('The data could not be parsed', { cause: error })
  }
}

/**
 * Return sample training sessions (for testing)
 */
export function getSampleTrainingSessions(): Promise<TrainingSession[]> {
  return Promise.resolve(sampleTrainingSessions)
}

const { getCache, setCache } = createCache<TrainingSession[]>()

export async function getAllTrainingSessions(
  options?: {
    refresh?: boolean
    fetchTrainingData?: () => Promise<TrainingSession[]>
  },
): Promise<TrainingSession[]> {
  // Use sample data in test mode unless explicitly overridden
  const isTestMode = Deno.env.get('DENO_TEST_MODE') === 'true'
  const defaultFetcher = isTestMode
    ? getSampleTrainingSessions
    : fetchTrainingFromGoogleSheets

  const { refresh, fetchTrainingData = defaultFetcher } = options ?? {}

  const cachedTraining = getCache()

  if (refresh || cachedTraining === undefined) {
    const training = await fetchTrainingData()
    setCache(training)
    return training
  }

  return cachedTraining
}
