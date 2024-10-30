import { parse } from '@std/csv'
import { removeObjectExtendedNullishValues } from 'helpers/remove-undefined-values.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import { isValidNumber } from '@edouardmisset/utils'

export const ascentsURL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQu1B4frLAYYVXD9-lam59jV6gqYYu93GoGUlPiRzkmd_f9Z6Fegf6m7xCMuOYeZxbWvb3dXxYw5JS1/pub?gid=1693455229&single=true&output=csv'
export const ascentFileName = 'ascent-data.json'

export const trainingURL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR60aQqhO9PL0072_4d78EPuHnbl4BncjNiDX3NmSMM3aOVPhLEkQaFjKqFqquT2fFTwYj0QtsRyFvc/pub?gid=277284868&single=true&output=csv'
export const trainingFileName = 'training-data.json'

const backupFilePath = './src/server/backup/'

type CSVHeaders = string[]
type CSVData = string[][]

type CSVParsedData = {
  headers: CSVHeaders
  data: CSVData
}

type TransformFunction = (value: string) => string | number

export const TRANSFORMED_ASCENT_HEADER_NAMES = {
  'Route Name': 'routeName',
  'Topo Grade': 'topoGrade',
  'Date': 'date',
  '# Tries': 'tries',
  'My Grade': 'personalGrade',
  'Height': 'height',
  'Profile': 'profile',
  'Holds': 'holds',
  'Rating': 'rating',
  'Route / Boulder': 'climbingDiscipline',
  'Crag': 'crag',
  'Area': 'area',
  'Departement': 'region',
  'Climber': 'climber',
  'Ascent Comments': 'comments',
} as const

export type GSAscentKeys = keyof typeof TRANSFORMED_ASCENT_HEADER_NAMES
export type JSAscentKeys = typeof TRANSFORMED_ASCENT_HEADER_NAMES[GSAscentKeys]

export const TRANSFORMED_TRAINING_HEADER_NAMES = {
  'Anatomical Region': 'anatomicalRegion',
  Comments: 'comments',
  Date: 'date',
  'Energy System': 'energySystem',
  'Gym / Crag': 'gymCrag',
  Intensity: 'intensity',
  LOAD: 'load',
  'Route / Bouldering': 'climbingDiscipline',
  'Type of Session': 'sessionType',
  Volume: 'volume',
} as const

export type GSTrainingKeys = keyof typeof TRANSFORMED_TRAINING_HEADER_NAMES
export type JSTrainingKeys =
  typeof TRANSFORMED_TRAINING_HEADER_NAMES[GSTrainingKeys]

/**
 * Fetches data from a URL and parses it as CSV.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<CSVParsedData>} - A promise that resolves to an object containing the headers and the parsed data.
 */
export async function fetchAndParseCSV(url: string): Promise<CSVParsedData> {
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
export function replaceHeaders(
  headers: CSVHeaders,
  transformedHeaderNames: Record<string, string>,
): string[] {
  return headers.map((header) => {
    const replacedHeader = transformedHeaderNames[header]
    if (!replacedHeader) {
      throw new Error(
        `Header (${header}) is not defined in "transformedHeaderNames"
${JSON.stringify(transformedHeaderNames)}`,
      )
    }

    return replacedHeader
  })
}

/**
 * Transforms a value to a string.
 * @param {string} value - The value to transform.
 * @returns {string} - The transformed string value.
 */
const transformToString: TransformFunction = (value) => String(value)

/**
 * Transforms a date string from "DD/MM/YYYY" format to ISO string.
 * @param {string} value - The date string to transform.
 * @returns {string} - The transformed ISO date string.
 */
const transformDate: TransformFunction = (value) => {
  const [day, month, year] = value.split('/')
  return new Date(`${year}-${month}-${day}T12:00:00Z`).toISOString()
}

/**
 * Transforms a height string by removing 'm' and converting to a number.
 * @param {string} value - The height string to transform.
 * @returns {number} - The transformed number value.
 */
const transformHeight: TransformFunction = (value) =>
  Number(value.replace('m', ''))

/**
 * Transforms a rating string by removing '*' and converting to a number.
 * @param {string} value - The rating string to transform.
 * @returns {number} - The transformed number value.
 */
const transformRating: TransformFunction = (value) =>
  Number(value.replace('*', ''))

/**
 * Transforms a tries string to extract style and number of tries.
 * @param {string} value - The tries string to transform.
 * @returns {{ style: 'Onsight' | 'Flash' | 'Redpoint', tries: number }} - The transformed style and tries.
 */
export function transformTries(
  value: string,
): { style: 'Onsight' | 'Flash' | 'Redpoint'; tries: number } {
  const style = value.includes('Onsight')
    ? 'Onsight'
    : value.includes('Flash')
    ? 'Flash'
    : 'Redpoint'

  const tries = Number(
    value.replace('go', '').replace('Onsight', '').replace('Flash', '').trim(),
  )

  return { style, tries }
}

/**
 * Transforms a session type string.
 * @param {string} value - The session type string to transform.
 * @returns {string} - The transformed session type.
 */
const transformSessionType: TransformFunction = (
  value,
) => (value === 'Ex' ? 'Out' : value)

/**
 * Transforms a climbing discipline string.
 * @param {string} value - The climbing discipline string to transform.
 * @returns {string} - The transformed climbing discipline.
 */
const transformClimbingDiscipline: TransformFunction = (
  value,
) => (value === 'Bouldering' ? 'Boulder' : value)

/**
 * Default transformation function that attempts to convert a string to a number.
 * @param {string} value - The value to transform.
 * @returns {string | number} - The transformed value as a number or string.
 */
const defaultTransform: TransformFunction = (value) => {
  const valueAsNumber = Number(value)
  return isValidNumber(valueAsNumber) ? valueAsNumber : value
}

export const TRANSFORM_FUNCTIONS: Record<
  string,
  TransformFunction
> = {
  area: transformToString,
  date: transformDate,
  height: transformHeight,
  rating: transformRating,
  routeName: transformToString,
  sessionType: transformSessionType,
  climbingDiscipline: transformClimbingDiscipline,
  default: defaultTransform,
} as const

/**
 * Transforms the csv data array based on the replaced headers.
 *
 * Note: Here, it's implied that the strings contained in the CSVData are only
 * representing basic JS data types (strings or numbers)
 *
 * @param {CSVData} csvData - The 2D data array.
 * @param {CSVHeaders} headers - The replaced headers.
 * @returns {Record<string, string | number | boolean>[]} - The transformed data array.
 */
export function transformClimbingData(
  csvData: CSVData,
  headers: CSVHeaders,
): Record<string, string | number | boolean>[] {
  return csvData.map((rowOfStrings) =>
    headers.reduce((acc, header, index) => {
      const valueAsString = rowOfStrings[index]

      if (valueAsString === '') return acc

      if (header === 'tries') {
        acc.style = transformTries(valueAsString).style
        acc[header] = transformTries(valueAsString).tries
      } else {
        const transform = TRANSFORM_FUNCTIONS[header] ??
          TRANSFORM_FUNCTIONS.default
        acc[header] = transform(valueAsString)
      }

      return acc
    }, {} as Record<CSVHeaders[number], string | number | boolean>)
  )
    .map((item) => removeObjectExtendedNullishValues(item))
    .map((item) => sortKeys(item))
}

/**
 * Writes the data to a file.
 * @param {string} fileName - The name of the file.
 * @param {Record<string, string | number | boolean>[]} data - The data to write.
 */
async function writeDataToFile(
  fileName: string,
  data: Record<string, string | number | boolean>[],
): Promise<void> {
  try {
    await Deno.writeTextFile(
      `${backupFilePath}${fileName}`,
      JSON.stringify({ data }, null, 2),
      { create: true },
    )
  } catch (error) {
    console.error(error)
  }
}

/**
 * Fetches, transforms, and writes CSV data from a given URL to a specified file with error handling.
 * @param {string} uri - The URI to fetch data from.
 * @param {string} fileName - The name of the file to write data to.
 * @returns {Promise<void>} - A promise that resolves when the data has been written.
 */
export async function processCsvDataFromUrl(
  { uri, fileName, transformedHeaderNames }: {
    uri: string
    fileName: string
    transformedHeaderNames: Record<string, string>
  },
): Promise<void> {
  try {
    const { headers, data } = await fetchAndParseCSV(uri)

    const replacedHeaders = replaceHeaders(headers, transformedHeaderNames)

    const transformedData = transformClimbingData(data, replacedHeaders)

    await writeDataToFile(fileName, transformedData)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Backup ascent and training data from Google Sheets.
 * @returns {Promise<boolean>} - A promise that resolves to true if the backup was successful, and false otherwise.
 */
export async function backupAscentsAndTrainingFromGoogleSheets(): Promise<
  boolean
> {
  try {
    await processCsvDataFromUrl(
      {
        uri: ascentsURL,
        fileName: ascentFileName,
        transformedHeaderNames: TRANSFORMED_ASCENT_HEADER_NAMES,
      },
    )

    await processCsvDataFromUrl(
      {
        uri: trainingURL,
        fileName: trainingFileName,
        transformedHeaderNames: TRANSFORMED_TRAINING_HEADER_NAMES,
      },
    )

    return true
  } catch (_error) {
    console.error(
      'An error occurred while backing up data from Google Sheets',
      _error,
    )
    return false
  }
}
