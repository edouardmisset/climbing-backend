import { Hono } from 'hono'

import ascentJSON from '@data/ascent-data.json' with { type: 'json' }
import { ascentSchema } from '@schema/ascent.ts'
import { etag } from 'hono/middleware'
import { frequency } from '@edouardmisset/utils'
import { findSimilar } from '@helpers/find-similar.ts'
import { sortNumericalValues } from '@helpers/sort-values.ts'

const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const app = new Hono()
app.use(etag())

// Get all known areas from the ascents
app.get('/', (ctx) => {
  const areas = Array.from(
    new Set(parsedAscents.map(({ area }) => area?.trim())),
  )
    .filter((crag) => crag !== undefined)
    .sort()

  return ctx.json({ data: areas })
})

// Get areas frequency
app.get('/frequency', (ctx) => {
  const areas = parsedAscents.map(({ area }) => area).filter((a) =>
    a !== undefined
  ) as string[]

  const sortedAreasByFrequency = sortNumericalValues(frequency(areas), false)
  return ctx.json({ data: sortedAreasByFrequency })
})

// Deduplicate the areas
app.get('/duplicates', (ctx) => {
  const definedAreas = parsedAscents.map(({ area }) => area).filter((a) =>
    a !== undefined
  ) as string[]

  const duplicateAreas = findSimilar(definedAreas)

  return ctx.json({ data: duplicateAreas })
})

export default app
