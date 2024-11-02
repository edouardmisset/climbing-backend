import { objectKeys } from '@edouardmisset/object'
import { createCache } from 'helpers/cache.ts'
import { removeObjectExtendedNullishValues } from 'helpers/remove-undefined-values.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import { type Ascent, ascentSchema } from 'schema/ascent.ts'
import {
  ASCENT_HEADERS,
  type GSAscentKeys,
  TRANSFORM_FUNCTIONS_GS_TO_JS,
  TRANSFORM_FUNCTIONS_JS_TO_GS,
  TRANSFORMED_ASCENT_HEADER_NAMES,
  type TransformFunctionJSToGS,
  transformTriesGSToJS,
} from 'helpers/transformers.ts'
import { loadWorksheet } from './google-sheets.ts'

/**
 * Transforms a raw ascent record from Google Sheets format to a JavaScript
 * object format.
 *
 * @param rawAscent - A record representing a single ascent with keys and values
 * as strings from Google Sheets.
 * @returns A transformed record with keys as strings and values as strings,
 * numbers, or booleans, representing the ascent in JavaScript format.
 */
function transformAscentFromGSToJS(
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

  if (!!options?.refresh || (cachedData === undefined)) {
    const ascents = await getAscentsFromDB()
    setCache(ascents)
    return ascents
  }

  return cachedData
}

// Key = JS ascent object's key
// Header = Google Sheet's ascent's header
function transformAscentFromJSToGS(
  ascent: Ascent,
): Record<GSAscentKeys, string> {
  return ASCENT_HEADERS.reduce((accumulator, header) => {
    const key = TRANSFORMED_ASCENT_HEADER_NAMES[header]

    // Special cases
    if (key === 'climber') {
      accumulator.Climber = 'Edouard Misset'
    } else if (key === 'tries') {
      const GSTries = TRANSFORM_FUNCTIONS_JS_TO_GS.tries({
        style: ascent.style,
        tries: ascent.tries,
      })
      accumulator['# Tries'] = GSTries
    } else {
      const rawValue = ascent[key] ?? ''

      //? how to deal with special chars in comments ?

      const keyAs = key as keyof typeof TRANSFORM_FUNCTIONS_JS_TO_GS
      const transformer =
        (objectKeys(TRANSFORM_FUNCTIONS_JS_TO_GS).includes(keyAs)
          ? TRANSFORM_FUNCTIONS_JS_TO_GS[keyAs]
          : TRANSFORM_FUNCTIONS_JS_TO_GS.default) as TransformFunctionJSToGS

      accumulator[header] = transformer(rawValue)
    }

    return accumulator
  }, {} as Record<GSAscentKeys, string>)
}

export async function addAscent(ascent: Ascent): Promise<void> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(transformAscentFromJSToGS(ascent))
}
