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

// CRUD operations

// READ

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

      if (key === 'tries') {
        acc[transformedKey] = transformTries(value).tries
        acc.style = transformTries(value).style
      } else {
        const transform = TRANSFORM_FUNCTIONS[key] ??
          TRANSFORM_FUNCTIONS.default
        acc[transformedKey] = transform(value)
      }
      return acc
    },
    {} as Record<string, string | number | boolean>,
  )

  return sortKeys(removeObjectExtendedNullishValues(transformedAscent))
}

// Main function to get all ascents
export async function getAllAscents(): Promise<Ascent[]> {
  const allAscentsSheet = await loadWorksheet('ascents')
  const rows = await allAscentsSheet.getRows()

  const rawAscents = rows
    .map((row) => transformAscentFromGSToJS(row.toObject()))

  return ascentSchema.array().parse(rawAscents)
}

// WRITE

export async function addAscent(ascent: Ascent): Promise<void> {
  const allAscentsSheet = await loadWorksheet('ascents')

  await allAscentsSheet.addRow(
    Object.values(ascentSchema.parse(ascent)).map(String),
  )
}

// UPDATE

// export async function updateAscent(
//   id: string,
//   updatedAscent: Ascent,
// ): Promise<void> {
//   await doc.loadInfo()

//   const ascentSheetTitle = 'AllSuccesses'
//   const allAscentsSheet = doc.sheetsByTitle[ascentSheetTitle]

//   if (!allAscentsSheet) {
//     throw new Error(`Sheet "${ascentSheetTitle}" not found`)
//   }

//   const existingAscent = await allAscentsSheet.getRow(Number(id))

//   if (!existingAscent) {
//     throw new Error(`Ascent with ID "${id}" not found`)
//   }

//   const updatedRow = existingAscent.copy()

//   for (const [key, value] of Object.entries(updatedAscent)) {
//     if (value === '') continue

//     if (key === 'tries') {
//       updatedRow.set(
//         TRANSFORMED_ASCENT_HEADER_NAMES.tries,
//         value,
//       )
//         .set(
//           TRANSFORMED_ASCENT_HEADER_NAMES.style,
//           transformTries(value).style,
//         )
//         .commit()
//         .catch((error) => console.error(error))
//       continue
//     }
//     const transform = TRANSFORM_FUNCTIONS[key] ??
//       TRANSFORM_FUNCTIONS.default
//     updatedRow.set(
//       TRANSFORMED_ASCENT_HEADER_NAMES[key],
//       transform(value),
//     )
//       .commit()
//       .catch((error) => console.error(error))
//     continue
//   }
// }

// DELETE

// export async function deleteAscent(
//   routeName: string,
//   crag?: string,
// ): Promise<void> {
//   await doc.loadInfo()

//   const ascentSheetTitle = 'AllSuccesses'
//   const allAscentsSheet = doc.sheetsByTitle[ascentSheetTitle]

//   if (!allAscentsSheet) {
//     throw new Error(`Sheet "${ascentSheetTitle}" not found`)
//   }

//   // Find the first row with the given route name and crag

//   const rowNumber: number = 0

//   await allAscentsSheet.clearRows({ start: rowNumber, end: rowNumber + 1 })
// }
