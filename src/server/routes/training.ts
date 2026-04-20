import { getAllTrainingSessions } from 'services/training.ts'
import { orpcServer } from './server.ts'
import { stringEquals } from '@edouardmisset/text'

export const list = orpcServer.training.list.handler(
  async ({ input }) => {
    const { year, gymCrag, sessionType, climbingDiscipline } = input ?? {}
    const sessions = await getAllTrainingSessions()

    return sessions.filter((
      session,
    ) =>
      (year === undefined
        ? true
        : new Date(session.date).getFullYear() === year) &&
      (gymCrag === undefined
        ? true
        : stringEquals(session.gymCrag ?? '', gymCrag)) &&
      (sessionType === undefined
        ? true
        : session.sessionType === sessionType) &&
      (climbingDiscipline === undefined ? true : session.climbingDiscipline ===
        climbingDiscipline)
    )
  },
)
