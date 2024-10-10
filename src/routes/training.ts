import { Hono } from 'hono'

import trainingJSON from 'data/training-data.json' with { type: 'json' }
import { trainingSessionSchema } from 'schema/training.ts'
import { etag } from 'hono/etag'
import { normalizeData } from '../helpers/normalize-data.ts'
import { zValidator } from 'zod-validator'
import { z } from 'zod'

const training = new Hono()
training.use(etag())

const parsedTrainingSessions = trainingSessionSchema.array().parse(
  trainingJSON.data,
)

training.get(
  '/',
  zValidator(
    'query',
    z.object({
      normalize: z.enum(['true', 'false']).optional().transform((value) =>
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

export default training
