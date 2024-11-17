import { Hono } from 'hono'

import { getAllTrainingSessions } from 'services/training.ts'

export const training = new Hono().get(
  '/',
  async (c) => c.json({ data: await getAllTrainingSessions() }),
)
