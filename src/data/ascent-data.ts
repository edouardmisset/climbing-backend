import { type Ascent } from 'schema/ascent.ts'

import { createCache } from 'helpers/cache.ts'
import { getAllAscents } from '../services/ascents.ts'

// Create cache expiry duration
const tenMinutesInMs = 10 * 60 * 1000
export const defaultCacheExpiryDurationInMs = tenMinutesInMs

const { getCache, setCache } = createCache<Ascent[]>(
  defaultCacheExpiryDurationInMs,
)

export async function getAscents(): Promise<Ascent[]> {
  const cachedData = getCache()
  if (cachedData !== undefined) return cachedData

  const ascents = await getAllAscents()
  // Cache the transformed data
  setCache(ascents)
  return ascents
}
