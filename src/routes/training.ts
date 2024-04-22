import { Hono } from 'hono'

import trainingJSON from '@data/training-data.json' with { type: 'json' }
import { trainingSessionSchema } from '@schema/training.ts'
import { etag } from 'hono/middleware'

const app = new Hono()
app.use(etag())

const parsedTrainingSessions = trainingSessionSchema.array().parse(
  trainingJSON.data,
)

app.get('/', (ctx) =>
  ctx.json({
    data: parsedTrainingSessions,
  }))

export default app
