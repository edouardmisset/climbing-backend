import { Hono } from 'hono'

import { frequency } from '@edouardmisset/utils'
import { getAscents } from 'data/ascent-data.ts'
import { findSimilar, groupSimilarStrings } from 'helpers/find-similar.ts'
import { sortNumericalValues } from 'helpers/sort-values.ts'
import { etag } from 'hono/etag'
import type { Ascent } from 'schema/ascent.ts'

const areas = new Hono()
areas.use(etag())

async function getValidAreas(): Promise<Exclude<Ascent['area'], undefined>[]> {
  const ascents = await getAscents()
  return ascents.map(({ area }) => area?.trim()).filter(
    (area) => area !== undefined,
  )
}

// Get all known areas from the ascents
areas.get('/', async (ctx) => {
  const validAreas = await getValidAreas()
  const areas = [...new Set(validAreas)].sort()

  return ctx.json({ data: areas })
})
  .get('/frequency', async (ctx) => {
    const validAreas = await getValidAreas()
    const sortedAreasByFrequency = sortNumericalValues(
      frequency(validAreas),
      false,
    )
    return ctx.json({ data: sortedAreasByFrequency })
  })
  .get('/duplicates', async (ctx) => {
    const validAreas = await getValidAreas()
    const duplicateAreas = findSimilar(validAreas)

    return ctx.json({ data: duplicateAreas })
  })
  .get('/similar', async (ctx) => {
    const validAreas = await getValidAreas()
    const similarAreas = Array.from(
      groupSimilarStrings(validAreas, 3).entries(),
    )

    return ctx.json({ data: similarAreas })
  })

export default areas
