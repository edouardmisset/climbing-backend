import { parse } from '@std/csv'
import { removeObjectExtendedNullishValues } from '@helpers/remove-undefined-values.ts'
import { sortKeys } from '@helpers/sort-keys.ts'

export const ascentsURL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQu1B4frLAYYVXD9-lam59jV6gqYYu93GoGUlPiRzkmd_f9Z6Fegf6m7xCMuOYeZxbWvb3dXxYw5JS1/pub?gid=1693455229&single=true&output=csv'
export const ascentFileName = 'ascent-data.json'

export const trainingURL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR60aQqhO9PL0072_4d78EPuHnbl4BncjNiDX3NmSMM3aOVPhLEkQaFjKqFqquT2fFTwYj0QtsRyFvc/pub?gid=277284868&single=true&output=csv'
export const trainingFileName = 'training-data.json'

type CSVHeaders = string[]
type CSVData = string[][]

type CSVParsedData = {
  headers: CSVHeaders
  data: CSVData
}

export const TRANSFORMED_ASCENT_HEADER_NAMES = {
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

export const TRANSFORMED_TRAINING_HEADER_NAMES = {
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

/**
 * Reads a CSV file and parses its content.
 * @param {string} fileName - The name of the file.
 * @returns {Promise<{ headers: CSVHeaders, array: CSVData }>} - A promise that resolves to an object containing the headers and the parsed data.
 */
async function readCsvFile(fileName: string): Promise<CSVParsedData> {
  const csv = await Deno.readTextFile(`./src/data/${fileName}`)
  const [headers, ...data] = parse(csv)
  return { headers, data }
}

/**
 * Fetches data from a URL and parses it as CSV.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<CSVParsedData>} - A promise that resolves to an object containing the headers and the parsed data.
 */
async function fetchAndParseData(url: string): Promise<CSVParsedData> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csv = await response.text()
    const [headers, ...data] = parse(csv)
    return { headers, data }
  } catch (error) {
    console.error('An error occurred while fetching and parsing data:', error)
    throw error
  }
}

/**
 * Replaces the headers with cleaned headers.
 * @param {CSVHeaders} headers - The original headers.
 * @param {Record<string, string>} transformedHeaderNames - The mapping of original headers to cleaned headers.
 * @returns {string[]} - The cleaned headers.
 */
function replaceHeaders(
  headers: CSVHeaders,
  transformedHeaderNames: Record<string, string>,
): string[] {
  return headers.map((header) => {
    const cleanedHeader = transformedHeaderNames[header]
    if (!cleanedHeader) {
      throw new Error(
        `Header (${header}) is not defined in "transformedHeaderNames"`,
      )
    }

    return cleanedHeader
  })
}

/**
 * Transforms the data array based on the replaced headers.
 * @param {CSVData} array - The original data array.
 * @param {CSVHeaders} replacedHeaders - The replaced headers.
 * @returns {Record<string, string | number>[]} - The transformed data array.
 */
function transformData(
  array: CSVData,
  replacedHeaders: CSVHeaders,
): Record<string, string | number>[] {
  return array.map((item) =>
    replacedHeaders.reduce((acc, header, index) => {
      const val = item[index]
      const numberVal = Number(val)
      acc[header] = val === '' ? '' : Number.isNaN(numberVal) ? val : numberVal
      return acc
    }, {} as Record<string, string | number>)
  )
    .map((item) => removeObjectExtendedNullishValues(item))
    .map((item) => sortKeys(item))
}

/**
 * Writes the data to a file.
 * @param {string} fileName - The name of the file.
 * @param {Record<string, string | number>[]} data - The data to write.
 */
async function writeDataToFile(
  fileName: string,
  data: Record<string, string | number>[],
): Promise<void> {
  await Deno.writeTextFile(
    `./src/data/${fileName}`,
    JSON.stringify({ data }),
    { create: true },
  )
}

/**
 * Fetches, transforms, and writes CSV data from a given URL to a specified file with error handling.
 * @param {string} uri - The URI to fetch data from.
 * @param {string} fileName - The name of the file to write data to.
 * @returns {Promise<void>} - A promise that resolves when the data has been written.
 */
export async function processCsvDataFromUrl(
  uri: string,
  fileName: string,
  transformedHeaderNames: Record<string, string>,
): Promise<void> {
  try {
    const { headers, data } = await fetchAndParseData(uri)
    const replacedHeaders = replaceHeaders(headers, transformedHeaderNames)
    const transformedData = transformData(data, replacedHeaders)
    await writeDataToFile(fileName, transformedData)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Synchronizes ascent and training data from Google Sheets.
 * @returns {Promise<boolean>} - A promise that resolves to true if the synchronization was successful, and false otherwise.
 */
export async function syncAscentsAndTrainingFromGoogleSheets(): Promise<boolean> {
  try {
    await processCsvDataFromUrl(
      ascentsURL,
      ascentFileName,
      TRANSFORMED_ASCENT_HEADER_NAMES,
    )
    await processCsvDataFromUrl(
      trainingURL,
      trainingFileName,
      TRANSFORMED_TRAINING_HEADER_NAMES,
    )
    return true
  } catch (_error) {
    console.error(
      'An error occurred while syncing data from Google Sheets',
      _error,
    )
    return false
  }
}
