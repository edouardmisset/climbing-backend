import { frequency as calcFrequency } from '@edouardmisset/array'
import { findSimilar, groupSimilarStrings } from 'helpers/find-similar.ts'
import { sortNumericalValues } from 'helpers/sort-values.ts'
import { getAllAscents } from 'services/ascents.ts'
import { orpcServer } from './server.ts'

async function getValidAreas(): Promise<string[]> {
  const ascents = await getAllAscents()
  return ascents.map(({ area }) => area?.trim()).filter(
    (area) => area !== undefined,
  )
}

export const list = orpcServer.areas.list.handler(
  async () => {
    const validAreas = await getValidAreas()
    return [...new Set(validAreas)].sort()
  },
)

export const frequency = orpcServer.areas.frequency.handler(
  async () => {
    const validAreas = await getValidAreas()
    return sortNumericalValues(
      calcFrequency(validAreas),
      false,
    )
  },
)

export const duplicates = orpcServer.areas.duplicates.handler(
  async () => {
    const validAreas = await getValidAreas()

    return findSimilar(validAreas)
  },
)

export const similar = orpcServer.areas.similar.handler(
  async () => {
    const validAreas = await getValidAreas()

    return Object.fromEntries(groupSimilarStrings(validAreas, 3))
  },
)
