import { Hono } from 'hono'
import { zValidator } from 'zod-validator'
import { getAllTrainingSessions } from 'services/training.ts'
import { z } from 'zod'

const createTrainingRoute = (fetchTraining = getAllTrainingSessions) =>
  new Hono().get(
    '/',
    zValidator(
      'query',
      z.object({
        year: z.string().optional(),
      })
        .optional(),
    ),
    async (c) => {
      const year = c.req.query('year')
      const sessions = await fetchTraining()

      const filteredSessions = sessions.filter((session) =>
        year === undefined || year === ''
          ? true
          : new Date(session.date).getFullYear().toString() === year
      )
      return c.json({ data: filteredSessions })
    },
  )

export { createTrainingRoute }
