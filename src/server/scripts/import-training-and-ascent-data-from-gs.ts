import { parse } from '@std/csv'
import { removeObjectExtendedNullishValues } from 'helpers/remove-undefined-values.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import {
  TRANSFORM_FUNCTIONS_GS_TO_JS,
  TRANSFORMED_ASCENT_HEADER_NAMES,
  TRANSFORMED_TRAINING_HEADER_NAMES,
  transformTriesGSToJS,
} from 'helpers/transformers.ts'
import { SHEETS_INFO } from 'services/google-sheets.ts'

const backupFilePath = './src/server/backup/'
const trainingFileName = 'training-data.json'
const ascentFileName = 'ascent-data.json'

type CSVHeaders = string[]
type CSVData = string[][]

type CSVParsedData = {
  headers: CSVHeaders
  data: CSVData
}

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
    globalThis.console.error(
      'An error occurred while fetching and parsing data:',
      error,
    )
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
        acc.style = transformTriesGSToJS(valueAsString).style
        acc[header] = transformTriesGSToJS(valueAsString).tries
      } else {
        const transform = TRANSFORM_FUNCTIONS_GS_TO_JS[
          header as keyof typeof TRANSFORM_FUNCTIONS_GS_TO_JS
        ] ??
          TRANSFORM_FUNCTIONS_GS_TO_JS.default
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
    globalThis.console.error(error)
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
    globalThis.console.error(error)
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
    const ascentBackupPromise = processCsvDataFromUrl(
      {
        uri: SHEETS_INFO.ascents.csvExportURL,
        fileName: ascentFileName,
        transformedHeaderNames: TRANSFORMED_ASCENT_HEADER_NAMES,
      },
    )

    const trainingBackupPromise = processCsvDataFromUrl(
      {
        uri: SHEETS_INFO.training.csvExportURL,
        fileName: trainingFileName,
        transformedHeaderNames: TRANSFORMED_TRAINING_HEADER_NAMES,
      },
    )

    const results = await Promise.allSettled(
      [ascentBackupPromise, trainingBackupPromise],
    )

    const allPromisesFulfilled = results.every(({ status }) =>
      status === 'fulfilled'
    )

    if (allPromisesFulfilled) {
      globalThis.console.log(
        'Backup of ascent and training data was successful.',
      )
    } else {
      globalThis.console.warn('Backup completed with some failures:', results)
    }

    return allPromisesFulfilled
  } catch (_error) {
    globalThis.console.error(
      'An error occurred while backing up data from Google Sheets',
      _error,
    )
    return false
  }
}
