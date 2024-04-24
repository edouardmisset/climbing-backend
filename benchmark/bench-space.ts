import { apiTestCases, baseURL } from './test-data.ts'

function formatBytesToHumanReadable(
  bytes: number = 0,
  unitSystem: 1000 | 1024 = 1024,
  precision: number = 0,
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
  const formattedValue = (bytes / unitSystem ** suffixIndex).toFixed(precision)

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
  } catch (error) {
    console.error(`Failed to fetch size for ${url}: ${error.message}`)
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

  console.log('Space')

  console.table(
    apiTestCases.map(({ name, size }, index, array) => ({
      name,
      size: formatBytesToHumanReadable(size),
      ratio: index % 2 === 0
        ? ''
        : `${(size / array[index - 1].size * 100).toFixed(0)}%`,
    })),
  )
}
