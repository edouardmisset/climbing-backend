import { getAllTrainingSessions } from 'services/training.ts'
import { orpcServer } from './server.ts'

export const list = orpcServer.training.list.handler(
  async ({ input }) => {
    const { year } = input ?? {}
    const sessions = await getAllTrainingSessions()

    return sessions.filter((session) =>
      year === undefined || year === ''
        ? true
        : new Date(session.date).getFullYear().toString() === year
    )
  },
)
