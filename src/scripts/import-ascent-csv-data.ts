import { parse } from '@std/csv'
import { removeObjectExtendedNullishValues } from '@helpers/remove-undefined-values.ts'
import { sortKeys } from '@helpers/sort-keys.ts'

const CSV_FILE_NAME = 'Edouard Misset Successes 🎉 - AllSuccesses.csv'

const TRANSFORMED_HEADER_NAMES = {
  'Route Name': 'routeName',
  'Topo Grade': 'topoGrade',
  'Date': 'date',
  '# Tries': 'tries',
  'My Grade': 'myGrade',
  'Height': 'height',
  'Profile': 'profile',
  'Holds': 'holds',
  'Rating': 'rating',
  'Route / Boulder': 'routeOrBoulder',
  'Crag': 'crag',
  'Area': 'area',
  'Departement': 'departement',
  'Climber': 'climber',
  'Ascent Comments': 'comments',
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
  const transformedData = array.map((item) =>
    replacedHeaders.reduce((acc, header, index) => {
      const val = item[index]
      const numberVal = Number(val)
      acc[header] = val === '' ? '' : Number.isNaN(numberVal) ? val : numberVal
      return acc
    }, {} as Record<string, unknown>)
  )
    .map((item) => removeObjectExtendedNullishValues(item))
    .map((item) => sortKeys(item))

  // Write the transformed data to a new file
  await Deno.writeTextFile(
    './src/data/ascent-data.json',
    JSON.stringify({ data: transformedData }),
    { create: true },
  )
} catch (error) {
  console.error(error)
}
