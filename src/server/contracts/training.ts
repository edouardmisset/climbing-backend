import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'
import { sessionTypeSchema, trainingSessionSchema } from '~/schema/training.ts'
import { yearSchema } from 'schema/generics.ts'
import { climbingDisciplineSchema } from 'schema/ascent.ts'

export const list = orpcContract
  .route({ method: 'GET', path: '/training' })
  .input(
    z.object({
      climbingDiscipline: climbingDisciplineSchema.optional(),
      sessionType: sessionTypeSchema.optional(),
      gymCrag: trainingSessionSchema.shape.gymCrag.optional(),
      year: yearSchema.optional(),
    }).optional(),
  )
  .output(trainingSessionSchema.array())
