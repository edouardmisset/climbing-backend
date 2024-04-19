import { parse } from '@std/csv'
import { removeObjectExtendedNullishValues } from '@helpers/remove-undefined-values.ts'
import { sortKeys } from '@helpers/sort-keys.ts'

const CSV_FILE_NAME = 'Training 🏋️‍♀️ - AllTraining.csv'

const TRANSFORMED_HEADER_NAMES = {
  'Anatomical Region': 'anatomicalRegion',
  Comments: 'comments',
  Date: 'date',
  'Energy System': 'energySystem',
  'Gym / Crag': 'gymCrag',
  Intensity: 'intensity',
  LOAD: 'load',
  'Route / Bouldering': 'routeOrBouldering',
  'Type of Session': 'sessionType',
  Volume: 'volume',
} as const

try {
  // Read the CSV file
  const data = await Deno.readTextFile(`./src/data/${CSV_FILE_NAME}`)
  const [headers, ...array] = parse(data)

  // Replace the headers
  const replacedHeaders = headers.map((header) => {
    const cleanedHeader =
      TRANSFORMED_HEADER_NAMES[header as keyof typeof TRANSFORMED_HEADER_NAMES]
    if (!cleanedHeader) {
      throw new Error(
        `Header (${header}) is not defined in CLEANED_HEADER_NAMES`,
      )
    }
    return cleanedHeader
  })

  // Transform the data
  const transformedData = (array.map((item) =>
    replacedHeaders.reduce((acc, header, index) => {
      const val = item[index]
      const numberVal = Number(val)
      acc[header] = val === ''
        ? ''
        : Number.isNaN(numberVal)
        ? val
        : numberVal
      return acc
    }, {} as Record<string, unknown>)
  ).map((item) =>
    removeObjectExtendedNullishValues(item)
  )).map((item) => sortKeys(item))

  // Write the transformed data to a new file
  await Deno.writeTextFile(
    './src/data/training-data.json',
    JSON.stringify({ data: transformedData }),
    { create: true },
  )
} catch (error) {
  console.error(error)
}
