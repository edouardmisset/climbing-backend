import { Hono } from 'hono'

import ascentJSON from '@data/ascent-data.json' with { type: 'json' }
import { ascentSchema } from '@schema/ascent.ts'
import { etag } from 'hono/middleware'
import { removeAccents } from '@edouardmisset/utils'
import { findSimilar } from '@helpers/find-similar.ts'

const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const app = new Hono()
app.use(etag())

// Get all known crags from the ascents
app.get('/', (ctx) => {
  const crags = Array.from(
    new Set(parsedAscents.map(({ crag }) => crag.trim())),
  )
    .filter((crag) => crag != null)
    .sort()

  return ctx.json({ data: crags })
})

app.get('/duplicates', (ctx) => {
  const similarCrags = findSimilar(
    parsedAscents.map(({ crag }) => crag).filter(Boolean),
  )
  return ctx.json({ data: similarCrags })
})

export default app
