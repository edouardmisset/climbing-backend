import { createCache } from 'helpers/cache.ts'
import { removeObjectExtendedNullishValues } from 'helpers/remove-undefined-values.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import {
  ASCENT_HEADERS,
  type GSAscentKeys,
  type GSAscentRecord,
  TRANSFORM_FUNCTIONS_GS_TO_JS,
  TRANSFORM_FUNCTIONS_JS_TO_GS,
  TRANSFORMED_ASCENT_HEADER_NAMES,
  transformTriesGSToJS,
  transformTriesJSToGS,
} from 'helpers/transformers.ts'
import { type Ascent, ascentSchema } from 'schema/ascent.ts'
import { loadWorksheet } from 'services/google-sheets.ts'

/**
 * Transforms a raw ascent record from Google Sheets format to a JavaScript
 * object format.
 *
 * @param rawAscent - A record representing a single ascent with keys and values
 * as strings from Google Sheets.
 * @returns A transformed record with keys as strings and values as strings,
 * numbers, or booleans, representing the ascent in JavaScript format.
 */
export function transformAscentFromGSToJS(
  rawAscent: Record<string, string>,
): Record<string, string | number | boolean> {
  const transformedAscent = Object.entries(rawAscent).reduce(
    (acc, [key, value]) => {
      if (value === '') return acc

      const transformedKey =
        TRANSFORMED_ASCENT_HEADER_NAMES[key as GSAscentKeys]

      if (transformedKey === 'tries') {
        acc[transformedKey] = transformTriesGSToJS(value).tries
        acc.style = transformTriesGSToJS(value).style
      } else {
        const transform = TRANSFORM_FUNCTIONS_GS_TO_JS[
          transformedKey as keyof typeof TRANSFORM_FUNCTIONS_GS_TO_JS
        ] ??
          TRANSFORM_FUNCTIONS_GS_TO_JS.default
        acc[transformedKey] = transform(value)
      }
      return acc
    },
    {} as Record<string, string | number | boolean>,
  )

  return sortKeys(removeObjectExtendedNullishValues(transformedAscent))
}

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
    .map((row) => transformAscentFromGSToJS(row.toObject()))

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

// Key = JS ascent object's key
// Header = Google Sheet's ascent's header
export function transformAscentFromJSToGS(
  ascent: Ascent,
): GSAscentRecord {
  return ASCENT_HEADERS.reduce((accumulator, header) => {
    const key = TRANSFORMED_ASCENT_HEADER_NAMES[header]

    // Special cases
    if (key === 'climber') {
      accumulator.Climber = 'Edouard Misset'
    } else if (key === 'tries') {
      const GSTries = transformTriesJSToGS({
        style: ascent.style,
        tries: ascent.tries,
      })
      accumulator['# Tries'] = GSTries
    } else {
      const rawStringValue = ascent[key]?.toString() ?? ''

      //? how to deal with special chars in comments ?

      const keyAs = key as keyof typeof TRANSFORM_FUNCTIONS_JS_TO_GS
      const transformer = keyAs in TRANSFORM_FUNCTIONS_JS_TO_GS
        ? TRANSFORM_FUNCTIONS_JS_TO_GS[keyAs]
        : String

      accumulator[header] = transformer(rawStringValue)
    }

    return accumulator
  }, {} as GSAscentRecord)
}

export async function addAscent(ascent: Ascent): Promise<void> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(transformAscentFromJSToGS(ascent))
}
