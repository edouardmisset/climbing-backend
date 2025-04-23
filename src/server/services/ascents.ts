import { createCache } from 'helpers/cache.ts'
import {
  type Ascent,
  ascentSchema,
  type OptionalAscentFilter,
} from 'schema/ascent.ts'
import { loadWorksheet } from 'services/google-sheets.ts'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from 'helpers/transformers.ts'
import { filterAscents } from 'helpers/filter-ascents.ts'

/**
 * Retrieves all ascent records from the Google Sheets 'ascents' worksheet,
 * transforms them from Google Sheets format to JavaScript object format,
 * and validates them against the ascent schema.
 *
 * @returns A promise that resolves to an array of Ascent objects, each
 * representing a validated ascent record.
 */
export async function getAscentsFromDB(): Promise<Ascent[]> {
  const allAscentsSheet = await loadWorksheet('ascents')
  const rows = await allAscentsSheet.getRows()

  const rawAscents = rows
    .map((row, index) => ({
      ...transformAscentFromGSToJS(row.toObject()),
      id: index,
    }))

  return ascentSchema.array().parse(rawAscents)
}

const { getCache, setCache } = createCache<Ascent[]>()

export async function getAllAscents(
  options?: { refresh?: boolean },
): Promise<Ascent[]> {
  const cachedData = getCache()

  if (options?.refresh === true || cachedData === undefined) {
    const ascents = await getAscentsFromDB()
    setCache(ascents)
    return ascents
  }

  return cachedData
}

export async function getFilteredAscents(
  filters?: OptionalAscentFilter,
): Promise<Ascent[]> {
  const ascents = await getAllAscents()
  if (filters === undefined) return ascents
  return filterAscents(ascents, filters)
}

export async function addAscent(ascent: Omit<Ascent, 'id'>): Promise<Ascent> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(transformAscentFromJSToGS(ascent))

  const allAscents = await getAllAscents({ refresh: true })

  return { ...ascent, id: allAscents.length - 1 }
}
