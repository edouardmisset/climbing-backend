import { Hono } from 'hono'

import ascentJSON from '@data/ascent-data.json' with { type: 'json' }
import { ascentSchema } from '@schema/ascent.ts'
import { etag } from 'hono/etag'
import { frequency } from '@edouardmisset/utils'
import { findSimilar } from '@helpers/find-similar.ts'
import { sortNumericalValues } from '@helpers/sort-values.ts'

const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const app = new Hono()
app.use(etag())

const validAreas = parsedAscents.map(({ area }) => area?.trim()).filter(Boolean)

// Get all known areas from the ascents
app.get('/', (ctx) => {
  const areas = [...new Set(validAreas)].sort()

  return ctx.json({ data: areas })
})

// Get areas frequency
app.get('/frequency', (ctx) => {
  const sortedAreasByFrequency = sortNumericalValues(
    frequency(validAreas),
    false,
  )
  return ctx.json({ data: sortedAreasByFrequency })
})

// Deduplicate the areas
app.get('/duplicates', (ctx) => {
  const duplicateAreas = findSimilar(validAreas)

  return ctx.json({ data: duplicateAreas })
})

export default app
