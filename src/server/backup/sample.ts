import backup from 'backup/ascent-data.json' with { type: 'json' }

const { data } = backup

const sampleSize = 100
const stratifyBy: (keyof (typeof data)[number])[] = [
  'crag',
  'climbingDiscipline',
  'style',
  'tries',
]

// Function to get a random sample of specified size from an array
function getRandomSample(arr: any[], sampleSize: number): any[] {
  const shuffled = arr.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, sampleSize)
}

// Function to perform stratified sampling by multiple keys
function stratifiedSample(
  data: any[],
  sampleSize: number,
  stratifyBy: string[],
): any[] {
  const strata = data.reduce((acc, entry) => {
    const key = stratifyBy.map((factor) => entry[factor]).join('|')
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(entry)
    return acc
  }, {} as { [key: string]: any[] })

  const sample: any[] = []
  const strataKeys = Object.keys(strata)
  const samplesPerStratum = Math.floor(sampleSize / strataKeys.length)

  strataKeys.forEach((key) => {
    const stratumSample = getRandomSample(strata[key], samplesPerStratum)
    sample.push(...stratumSample)
  })

  // If there are remaining samples to be taken, randomly select from all strata
  const remainingSamples = sampleSize - sample.length
  if (remainingSamples > 0) {
    const allEntries = Object.values(strata).flat()
    const additionalSamples = getRandomSample(allEntries, remainingSamples)
    sample.push(...additionalSamples)
  }

  return sample
}

// Select n random ascents from the data using stratified sampling by multiple keys
const subset = stratifiedSample(data, sampleSize, stratifyBy)

// Write the subset to a new JSON file
await Deno.writeTextFile(
  `./src/server/backup/ascent-data-sample-${(new Date()).toISOString()}.json`,
  JSON.stringify(subset, null, 2),
)

globalThis.console.log(
  `Sampled ${subset.length} entries from the original data.`,
)
