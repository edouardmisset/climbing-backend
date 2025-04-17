import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver, validator as zValidator } from 'hono-openapi/zod'
import { trainingSessionSchema } from 'schema/training.ts'
import { getAllTrainingSessions } from 'services/training.ts'
import { z } from 'zod'

export const training = new Hono().get(
  '/',
  describeRoute({
    description: 'Get all training sessions with optional year filtering',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: resolver(
              z.object({
                data: z.array(trainingSessionSchema),
              }).openapi({
                example: {
                  data: [
                    {
                      anatomicalRegion: 'Ge',
                      climbingDiscipline: 'Route',
                      date: '2024-12-23T12:00:00.000Z',
                      energySystem: 'AL',
                      gymCrag: 'Restonica',
                      intensity: 40,
                      load: 16,
                      sessionType: 'Out',
                      volume: 40,
                    },
                    {
                      anatomicalRegion: 'Ge',
                      climbingDiscipline: 'Route',
                      comments: 'Première sortie en extérieur avec Velcroc :) ',
                      date: '2024-12-30T12:00:00.000Z',
                      energySystem: 'AL',
                      gymCrag: 'Gorges du Blavet',
                      intensity: 60,
                      load: 18,
                      sessionType: 'Out',
                      volume: 30,
                    },
                  ],
                },
              }),
            ),
          },
        },
      },
    },
  }),
  zValidator(
    'query',
    z
      .object({
        year: z.string().optional(),
      })
      .optional()
      .openapi({
        ref: 'query',
      }),
  ),
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
