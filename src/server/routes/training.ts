import { Hono } from 'hono'
import { zValidator } from 'zod-validator'
import { getAllTrainingSessions } from 'services/training.ts'
import { z } from 'zod'
import { yearSchema } from 'schema/generics.ts'

const createTrainingRoute = (fetchTraining = getAllTrainingSessions) =>
  new Hono().get(
    '/',
    zValidator(
      'query',
      z.object({
        year: yearSchema.optional(),
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
