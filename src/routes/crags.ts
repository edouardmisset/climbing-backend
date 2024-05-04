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

// Get all known crags from the ascents
app.get('/', (ctx) => {
  const crags = Array.from(
    new Set(parsedAscents.map(({ crag }) => crag.trim())),
  )
    .sort()

  return ctx.json({ data: crags })
})

// Get crags frequency
app.get('/frequency', (ctx) => {
  const crags = parsedAscents.map(({ crag }) => crag)

  const sortedCragsByFrequency = sortNumericalValues(frequency(crags), false)
  return ctx.json({ data: sortedCragsByFrequency })
})

app.get('/duplicates', (ctx) => {
  const similarCrags = findSimilar(
    parsedAscents.map(({ crag }) => crag).filter(Boolean),
  )
  return ctx.json({ data: similarCrags })
})

export default app
