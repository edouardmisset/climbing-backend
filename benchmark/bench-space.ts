import { apiTestCases, baseURL } from './test-data.ts'

const { log, error } = globalThis.console

function formatBytesToHumanReadable(
  bytes: number = 0,
  unitSystem: 1000 | 1024 = 1024,
): string {
  if (bytes < 0) {
    throw new Error('Input value must be non-negative.')
  }

  const suffixes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ]

  // Calculate the suffix index based on the logarithm of the input value
  const suffixIndex = Math.floor(Math.log(bytes) / Math.log(unitSystem))

  // Calculate the formatted value
  let rawValue = bytes / unitSystem ** suffixIndex

  // Round the value to the nearest whole number
  rawValue = Math.round(rawValue)

  // Ensure the value is at least 6 characters long by padding with spaces if necessary
  const formattedValue = rawValue.toString().padStart(6, ' ')

  // Retrieve the appropriate suffix
  const suffix = suffixes[suffixIndex]

  return `${formattedValue} ${suffix}`
}

async function fetchAndStoreResponseSize(
  name: string,
  url: string,
): Promise<void> {
  const size = await fetchJsonResponseSize(url)

  const test = apiTestCases.find((test) => test.name === name)
  if (test !== undefined) {
    test.size = size
  }
}

async function fetchJsonResponseSize(
  url: string,
): Promise<number> {
  try {
    const response = await fetch(url)
    const jsonObject = JSON.stringify(await response.json())
    const blob = new Blob([jsonObject], { type: 'application/json' })
    const responseSize = blob.size
    if (responseSize) {
      return responseSize
    }
    throw new Error('Content-Length header not found.')
  } catch (err) {
    error(`Failed to fetch size for ${url}: ${err.message}`)
    return 0
  }
}

async function processAllTestEndpoints(): Promise<void> {
  await Promise.all(
    apiTestCases.map(async ({ name, normalize, endpoint }) => {
      const url = `${baseURL}/${endpoint}${normalize ? '?normalize=true' : ''}`
      await fetchAndStoreResponseSize(name, url)
    }),
  )
}

export async function runSpaceBench(): Promise<void> {
  await processAllTestEndpoints()

  // Calculate the maximum length of the test names for alignment
  const maxNameLength = apiTestCases.reduce(
    (max, { name }) => Math.max(max, name.length),
    0,
  )

  const separator = `\t\t`;

  // Print the table headers with colors and boldness
  const headers = `📝 Test Name${' '.repeat(maxNameLength - 9)
    }${separator}📦 Size${separator}📈 Ratio (%)`

  log(headers)
  const allSeparatorSize = 16
  log(`${'-'.repeat(headers.length + allSeparatorSize)}`)

  // Print each row of the table
  apiTestCases.forEach(({ name, size }, index, array) => {
    const ratio = index % 2 === 0
      ? ''
      : `${(size / array[index - 1].size * 100).toFixed(0)}%`

    // Determine the color based on whether the first test case's name is included in the current test case's name
    const colorCode =
      name.toLowerCase().includes(apiTestCases[0].name.toLowerCase())
        ? '32'
        : '33'
    // Pad the test name with spaces to align the columns
    const paddedName = name.padEnd(maxNameLength, ' ')
    const formattedSize = formatBytesToHumanReadable(size)

    log(`\x1b[${colorCode}m${paddedName}${separator}${formattedSize}${separator}${ratio}\x1b[0m`)
  })
}
