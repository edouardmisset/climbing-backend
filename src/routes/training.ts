import { Hono } from 'hono'

import trainingJSON from '@data/training-data.json' with { type: 'json' }
import { trainingSessionSchema } from '@schema/training.ts'
import { etag } from 'hono/middleware'
import { normalizeData } from '../helpers/normalize-data.ts'

const app = new Hono()
app.use(etag())

const parsedTrainingSessions = trainingSessionSchema.array().parse(
  trainingJSON.data,
)

app.get('/', (ctx) => {
  const { normalize = false } = ctx.req.query()

  return ctx.json({
    data: normalize
      ? normalizeData(parsedTrainingSessions)
      : parsedTrainingSessions,
  })
})

export default app
