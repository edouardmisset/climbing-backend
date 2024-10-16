import { Hono } from 'hono'

import { etag } from 'hono/etag'
import { normalizeData } from '../helpers/normalize-data.ts'
import { zValidator } from 'zod-validator'
import { z } from 'zod'
import { getTrainingSessions } from 'data/training-data.ts'

const training = new Hono()
training.use(etag())

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
  async (ctx) => {
    const { normalize } = ctx.req.valid('query')

    const trainingSessions = await getTrainingSessions()

    return ctx.json({
      data: normalize ? normalizeData(trainingSessions) : trainingSessions,
    })
  },
)

export default training
