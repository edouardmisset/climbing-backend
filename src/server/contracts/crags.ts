import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'
import { ascentSchema } from '~/schema/ascent.ts'

export const list = orpcContract
  .route({ method: 'GET', path: '/crags' })
  .output(ascentSchema.shape.crag.array())

export const frequency = orpcContract
  .route({ method: 'GET', path: '/crags/frequency' })
  .output(z.record(ascentSchema.shape.crag, z.number()))

export const mostSuccessful = orpcContract
  .route({ method: 'GET', path: '/crags/most-successful' })
  .input(
    z.object({
      weightByGrade: z.boolean().optional(),
    }),
  )
  .output(z.record(ascentSchema.shape.crag, z.number()))

export const duplicates = orpcContract
  .route({ method: 'GET', path: '/crags/duplicates' })
  .output(z.record(ascentSchema.shape.crag, z.string().array()).array())

export const similar = orpcContract
  .route({ method: 'GET', path: '/crags/similar' })
  .output(z.record(ascentSchema.shape.crag, z.string().array()))
