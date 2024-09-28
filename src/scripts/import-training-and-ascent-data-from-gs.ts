import { parse } from '@std/csv'
import { removeObjectExtendedNullishValues } from '@helpers/remove-undefined-values.ts'
import { sortKeys } from '@helpers/sort-keys.ts'
import { isValidNumber } from '@edouardmisset/utils'
import { endTime, startTime } from 'hono/timing'
import { Context } from 'hono'

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
 * Transforms the csv data array based on the replaced headers.
 *
 * Note: Here, it's implied that the strings contained in the CSVData are only
 * representing basic JS data types (strings or numbers)
 *
 * @param {CSVData} csvData - The 2D data array.
 * @param {CSVHeaders} headers - The replaced headers.
 * @returns {Record<string, string | number>[]} - The transformed data array.
 */
function transformData(
  csvData: CSVData,
  headers: CSVHeaders,
): Record<string, string | number>[] {
  return csvData.map((rowOfStrings) =>
    headers.reduce((acc, header, index) => {
      const valueAsString = rowOfStrings[index]
      if (valueAsString === '') {
        acc[header] = valueAsString
      } // Naive approach:
      // only have transforms for headers that need it
      // Transform ascents
      else if (header === 'area') {
        // Ensure we keep the value as a string and we do not try to force it as
        // a number
        acc[header] = String(valueAsString)
      } else if (header === 'date') {
        // We assume the following date format "DD/MM/YYYY" and check it
        try {
          const datePattern = /\d{2}\/\d{2}\/\d{4}/
          datePattern.test(valueAsString)
          const [day, month, year] = valueAsString.split('/')
          acc[header] = new Date(`${year}-${month}-${day}T12:00:00Z`)
            .toISOString()
        } catch (error) {
          console.error(error)
        }
      } else if (header === 'height') {
        // Extract the number value if possible. If there is no value set the
        // value to 0
        acc[header] = Number(valueAsString.replace('m', ''))
      } else if (header === 'rating') {
        // Extract the number value if possible. If there is no value set the
        // value to 0
        acc[header] = Number(valueAsString.replace('*', ''))
      } else if (header === 'tries') {
        // Extract the number value if possible. If there is no value set the
        // value to 0

        acc.style = valueAsString.includes('Onsight')
          ? 'Onsight'
          : valueAsString.includes('Flash')
          ? 'Flash'
          : 'Redpoint'

        acc[header] = Number(
          valueAsString.replace('go', '').replace('Onsight', '').replace(
            'Flash',
            '',
          ).trim(),
        )
      } // Transform Training Sessions
      else if (header === 'sessionType') {
        acc[header] = valueAsString === 'Ex' ? 'Out' : valueAsString
      } else if (header === 'climbingDiscipline') {
        acc[header] = valueAsString === 'Bouldering' ? 'Boulder' : valueAsString
      } else {
        const valueAsNumber = Number(valueAsString)
        const typedValue = isValidNumber(valueAsNumber)
          ? valueAsNumber
          : valueAsString
        acc[header] = typedValue
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
  { uri, fileName, transformedHeaderNames, c }: {
    uri: string
    fileName: string
    transformedHeaderNames: Record<string, string>
    c: Context
  },
): Promise<void> {
  try {
    startTime(c, 'fetch', 'Fetch and parse Data from GS')
    const { headers, data } = await fetchAndParseData(uri)
    endTime(c, 'fetch')

    startTime(c, 'replace-headers', 'Replace the headers to the new model')
    const replacedHeaders = replaceHeaders(headers, transformedHeaderNames)
    endTime(c, 'replace-headers')

    startTime(c, 'transform', 'Transform the received data to the new model')
    const transformedData = transformData(data, replacedHeaders)
    endTime(c, 'transform')

    startTime(c, 'write', 'Write Data to disk as json')
    await writeDataToFile(fileName, transformedData)
    endTime(c, 'write')
  } catch (error) {
    console.error(error)
  }
}

/**
 * Synchronizes ascent and training data from Google Sheets.
 * @returns {Promise<boolean>} - A promise that resolves to true if the synchronization was successful, and false otherwise.
 */
export async function syncAscentsAndTrainingFromGoogleSheets(
  c: Context,
): Promise<
  boolean
> {
  try {
    startTime(c, 'ascents', 'Processing ascents')
    await processCsvDataFromUrl(
      {
        uri: ascentsURL,
        fileName: ascentFileName,
        transformedHeaderNames: TRANSFORMED_ASCENT_HEADER_NAMES,
        c,
      },
    )
    endTime(c, 'ascents')

    startTime(c, 'training', 'Processing training')
    await processCsvDataFromUrl(
      {
        uri: trainingURL,
        fileName: trainingFileName,
        transformedHeaderNames: TRANSFORMED_TRAINING_HEADER_NAMES,
        c,
      },
    )
    endTime(c, 'training')

    return true
  } catch (_error) {
    console.error(
      'An error occurred while syncing data from Google Sheets',
      _error,
    )
    return false
  }
}
