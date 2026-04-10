import ascentData from 'backup/ascent-data.json' with { type: 'json' }
import trainingData from 'backup/training-data.json' with { type: 'json' }
import { objectKeys } from '@edouardmisset/object'

const sampleSize = 100
const stratifyAscentBy: (keyof (typeof ascentData)[number])[] = [
  'crag',
  'climbingDiscipline',
  'style',
  'tries',
]

const stratifyTrainingBy: (keyof (typeof trainingData)[number])[] = [
  'sessionType',
  'volume',
  'intensity',
  'climbingDiscipline',
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
  const strataKeys = objectKeys(strata)
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
const ascentSubset = stratifiedSample(ascentData, sampleSize, stratifyAscentBy)
const trainingSubset = stratifiedSample(
  trainingData,
  sampleSize,
  stratifyTrainingBy,
)

// Write the subset to a new JSON file
await Deno.writeTextFile(
  `./src/server/backup/ascent-data-sample.json`,
  JSON.stringify(ascentSubset, null, 2),
)
await Deno.writeTextFile(
  `./src/server/backup/training-data-sample.json`,
  JSON.stringify(trainingSubset, null, 2),
)

globalThis.console.log(
  `Sampled ${ascentSubset.length} ascents and training sessions from the original data.`,
)
