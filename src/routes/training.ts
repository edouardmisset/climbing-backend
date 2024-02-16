import { Hono } from 'hono'

import trainingJSON from '../../data/training-data.json' with { type: 'json' }

import { trainingSessionSchema } from '../../schema/training.ts'

const app = new Hono()

const parsedTrainingSessions = trainingSessionSchema.array().parse(
  trainingJSON.data,
)

app.get('/', (ctx) =>
  ctx.json({
    data: parsedTrainingSessions,
  }))

export default app
