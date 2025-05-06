import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'
import { trainingSessionSchema } from '~/schema/training.ts'
import { yearSchema } from 'schema/generics.ts'

export const list = orpcContract
  .route({ method: 'GET', path: '/training' })
  .input(
    z.object({
      year: yearSchema.optional(),
    }).optional(),
  )
  .output(trainingSessionSchema.array())
