import { oc as orpcContract } from '@orpc/contract'
import { ascentSchema } from 'schema/ascent.ts'
import { z } from 'zod'

const climbingDisciplineAndYearOptionalSchema = z.object({
  climbingDiscipline: ascentSchema.shape.climbingDiscipline.optional(),
  year: z.number().optional(),
}).optional()

export const list = orpcContract
  .route({ method: 'GET', path: '/grades' })
  .input(
    climbingDisciplineAndYearOptionalSchema,
  )
  .output(z.string().array())

export const frequency = orpcContract
  .route({ method: 'GET', path: '/grades/frequency' })
  .input(
    climbingDisciplineAndYearOptionalSchema,
  )
  .output(z.record(z.string(), z.number()))

export const average = orpcContract
  .route({ method: 'GET', path: '/grades/average' })
  .input(
    climbingDisciplineAndYearOptionalSchema,
  )
  .output(z.string())
