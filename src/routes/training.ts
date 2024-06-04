import { Hono } from 'hono'

import trainingJSON from '@data/training-data.json' with { type: 'json' }
import { trainingSessionSchema } from '@schema/training.ts'
import { etag } from 'hono/etag'
import { normalizeData } from '../helpers/normalize-data.ts'
import { zValidator } from 'zod-validator'
import { z } from 'zod'

const app = new Hono()
app.use(etag())

const parsedTrainingSessions = trainingSessionSchema.array().parse(
  trainingJSON.data,
)

app.get(
  '/',
  zValidator(
    'query',
    z.object({
      normalize: z.enum(['true', 'false']).transform((value) =>
        value === 'true'
      ),
    }),
  ),
  (ctx) => {
    const { normalize } = ctx.req.valid('query')

    return ctx.json({
      data: normalize
        ? normalizeData(parsedTrainingSessions)
        : parsedTrainingSessions,
    })
  },
)

export default app
