import { createCache } from 'helpers/cache.ts'
import {
  type Ascent,
  ascentSchema,
  type OptionalAscentFilter,
} from 'schema/ascent.ts'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from 'helpers/transformers.ts'
import { filterAscents } from 'helpers/filter-ascents.ts'
import { loadWorksheet } from './google-sheets.ts'
import { sampleAscents } from 'backup/samples.ts'

/**
 * Fetch ascents from Google Sheets
 */
async function fetchAscentsFromGoogleSheets(): Promise<Ascent[]> {
  const allAscentsSheet = await loadWorksheet('ascents')
  const rows = await allAscentsSheet.getRows()

  const rawAscents = rows
    .map((row, index) => ({
      ...transformAscentFromGSToJS(row.toObject()),
      id: index,
    }))

  return ascentSchema.array().parse(rawAscents)
}

/**
 * Return sample ascents (for testing)
 */
export function getSampleAscents(): Promise<Ascent[]> {
  return Promise.resolve(sampleAscents)
}

const { getCache, setCache } = createCache<Ascent[]>()

export async function getAllAscents(
  options?: {
    refresh?: boolean
    fetchAscentData?: () => Promise<Ascent[]>
  },
): Promise<Ascent[]> {
  const isTestMode = Deno.env.get('DENO_TEST_MODE') === 'true'
  const defaultFetcher = isTestMode
    ? getSampleAscents
    : fetchAscentsFromGoogleSheets

  const { refresh, fetchAscentData = defaultFetcher } = options ?? {}

  const cachedAscents = getCache()

  if (refresh || cachedAscents === undefined) {
    const ascents = await fetchAscentData()
    setCache(ascents)
    return ascents
  }

  return cachedAscents
}

export async function getFilteredAscents(
  filters?: OptionalAscentFilter,
  options?: { refresh?: boolean; fetchAscentData?: () => Promise<Ascent[]> },
): Promise<Ascent[]> {
  const ascents = await getAllAscents(options)
  if (filters === undefined) return ascents
  return filterAscents(ascents, filters)
}

export async function addAscent(ascent: Omit<Ascent, 'id'>): Promise<Ascent> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(transformAscentFromJSToGS(ascent))

  const allAscents = await getAllAscents({ refresh: true })

  return { ...ascent, id: allAscents.length }
}
