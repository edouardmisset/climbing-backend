import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'
import { trainingSessionSchema } from '~/schema/training.ts'

export const list = orpcContract
  .route({ method: 'GET', path: '/training' })
  .input(
    z.object({
      year: z.string().optional(),
    }).optional(),
  )
  .output(trainingSessionSchema.array())
