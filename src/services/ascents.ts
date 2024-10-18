import { removeObjectExtendedNullishValues } from 'helpers/remove-undefined-values.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import {
  TRANSFORM_FUNCTIONS,
  TRANSFORMED_ASCENT_HEADER_NAMES,
  transformTries,
} from 'scripts/import-training-and-ascent-data-from-gs.ts'
import { doc } from './google-sheets.ts'
import { type Ascent, ascentSchema } from 'schema/ascent.ts'

// CRUD operations

// READ

export async function getAllAscents(): Promise<Ascent[]> {
  await doc.loadInfo()

  const ascentSheetTitle = 'AllSuccesses'
  const allAscentsSheet = doc.sheetsByTitle[ascentSheetTitle]

  if (!allAscentsSheet) {
    throw new Error(`Sheet "${ascentSheetTitle}" not found`)
  }
  const rows = await allAscentsSheet.getRows()

  const rawAscents = rows
    // Transform to Objects
    .map((row) => row.toObject())
    // Transform keys to new keys
    .map((rawAscent: Record<string, string>) =>
      Object.fromEntries(
        Object.entries(rawAscent).map((
          [key, value],
        ) => {
          return [
            TRANSFORMED_ASCENT_HEADER_NAMES[
              key as keyof typeof TRANSFORMED_ASCENT_HEADER_NAMES
            ],
            value,
          ]
        }),
      )
    )
    // Transform values to new types
    .map((rawAscent) =>
      Object.entries(rawAscent).reduce((acc, [key, value]) => {
        if (value === '') return acc
        if (key === 'tries') {
          acc[key] = transformTries(value).tries
          acc.style = transformTries(value).style
        } else {
          const transform = TRANSFORM_FUNCTIONS[key] ??
            TRANSFORM_FUNCTIONS.default
          acc[key] = transform(value)
        }
        return acc
      }, {} as Record<string, string | number | boolean>)
    )
    // Remove empty objects
    .map((item) => removeObjectExtendedNullishValues(item))
    // Sort keys
    .map((item) => sortKeys(item))

  const parsedAscents = ascentSchema.array().parse(rawAscents)

  return parsedAscents
}

// WRITE

export async function addAscent(ascent: Ascent): Promise<void> {
  await doc.loadInfo()

  const ascentSheetTitle = 'AllSuccesses'
  const allAscentsSheet = doc.sheetsByTitle[ascentSheetTitle]

  if (!allAscentsSheet) {
    throw new Error(`Sheet "${ascentSheetTitle}" not found`)
  }

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
