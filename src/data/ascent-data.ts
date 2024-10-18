import { type Ascent, ascentSchema } from 'schema/ascent.ts'
import {
  ascentsURL,
  fetchAndParseCSV,
  replaceHeaders,
  transformClimbingData,
  TRANSFORMED_ASCENT_HEADER_NAMES,
} from '../scripts/import-training-and-ascent-data-from-gs.ts'

import { createCache } from 'helpers/cache.ts'

// Create cache expiry duration
const tenMinutesInMs = 10 * 60 * 1000
export const defaultCacheExpiryDurationInMs = tenMinutesInMs

const { getCache, setCache } = createCache<Ascent[]>(
  defaultCacheExpiryDurationInMs,
)

export async function getAscents(): Promise<Ascent[]> {
  const cachedData = getCache()
  if (cachedData !== undefined) {
    return cachedData
  }

  // Fetch and parse CSV data
  const { data, headers } = await fetchAndParseCSV(ascentsURL)
  // Transform CSV data into Array of Ascents
  const transformedHeaders = replaceHeaders(
    headers,
    TRANSFORMED_ASCENT_HEADER_NAMES,
  )

  const transformedClimbingData = transformClimbingData(
    data,
    transformedHeaders,
  )

  try {
    const parsedData = ascentSchema.array().parse(transformedClimbingData)
    // Cache the transformed data
    setCache(parsedData)
    return parsedData
  } catch (error) {
    throw new Error('The data could not be parsed', error as Error)
  }
}
