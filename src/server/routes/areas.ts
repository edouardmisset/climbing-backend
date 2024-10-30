import { Hono } from 'hono'

import { frequency } from '@edouardmisset/utils'
import { findSimilar, groupSimilarStrings } from 'helpers/find-similar.ts'
import { sortNumericalValues } from 'helpers/sort-values.ts'
import type { Ascent } from 'schema/ascent.ts'
import { getAllAscents } from 'services/ascents.ts'

async function getValidAreas(): Promise<Exclude<Ascent['area'], undefined>[]> {
  const ascents = await getAllAscents()
  return ascents.map(({ area }) => area?.trim()).filter(
    (area) => area !== undefined,
  )
}

// Get all known areas from the ascents
export const areas = new Hono().get('/', async (c) => {
  const validAreas = await getValidAreas()
  const a = [...new Set(validAreas)].sort()

  return c.json({ data: a })
})
  .get('/frequency', async (c) => {
    const validAreas = await getValidAreas()
    const sortedAreasByFrequency = sortNumericalValues(
      frequency(validAreas),
      false,
    )
    return c.json({ data: sortedAreasByFrequency })
  })
  .get('/duplicates', async (c) => {
    const validAreas = await getValidAreas()
    const duplicateAreas = findSimilar(validAreas)

    return c.json({ data: duplicateAreas })
  })
  .get('/similar', async (c) => {
    const validAreas = await getValidAreas()
    const similarAreas = Array.from(
      groupSimilarStrings(validAreas, 3).entries(),
    )

    return c.json({ data: similarAreas })
  })
