import { removeObjectExtendedNullishValues } from 'helpers/remove-undefined-values.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import { type Ascent, ascentSchema } from 'schema/ascent.ts'
import {
  type GSAscentKeys,
  TRANSFORM_FUNCTIONS,
  TRANSFORMED_ASCENT_HEADER_NAMES,
  transformTries,
} from 'scripts/import-training-and-ascent-data-from-gs.ts'
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
        acc[transformedKey] = transformTries(value).tries
        acc.style = transformTries(value).style
      } else {
        const transform = TRANSFORM_FUNCTIONS[transformedKey] ??
          TRANSFORM_FUNCTIONS.default
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
export async function getAllAscents(): Promise<Ascent[]> {
  const allAscentsSheet = await loadWorksheet('ascents')
  const rows = await allAscentsSheet.getRows()

  const rawAscents = rows
    .map((row) => transformAscentFromGSToJS(row.toObject()))

  return ascentSchema.array().parse(rawAscents)
}

// WRITE

export async function addAscent(ascent: Ascent): Promise<void> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(
    Object.values(ascentSchema.parse(ascent)).map(String),
    {},
  )
}
