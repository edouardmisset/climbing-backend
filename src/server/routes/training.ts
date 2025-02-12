import { Hono } from 'hono'

import { getAllTrainingSessions } from 'services/training.ts'

export const training = new Hono().get(
  '/',
  async (c) => {
    const year = c.req.query('year')
    const sessions = await getAllTrainingSessions()

    const filteredSessions = sessions.filter((session) =>
      year === undefined || year === ''
        ? true
        : new Date(session.date).getFullYear().toString() === year
    )
    return c.json({ data: filteredSessions })
  },
)
