import { Hono } from 'hono'

import { getTrainingSessions } from 'services/training.ts'

export const training = new Hono().get(
  '/',
  async (c) => {
    const trainingSessions = await getTrainingSessions()
    return c.json({
      data: trainingSessions,
      metadata: { length: trainingSessions.length },
    })
  },
)
