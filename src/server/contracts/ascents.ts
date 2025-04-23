import { validNumberWithFallback } from '@edouardmisset/math'
import { oc as orpcContract } from '@orpc/contract'
import { ascentSchema, optionalAscentFilterSchema } from 'schema/ascent.ts'
import { z } from 'zod'

export const list = orpcContract
  .route({ method: 'GET', path: '/ascents' })
  .input(optionalAscentFilterSchema)
  .output(ascentSchema.array())

export const search = orpcContract
  .route({ method: 'GET', path: '/ascents/search' })
  .input(
    z.object({
      query: z.string().min(1),
      limit: z.string().transform((val) => validNumberWithFallback(val, 10)),
    }),
  )
  .output(
    ascentSchema
      .extend({
        highlight: z.string(),
        target: z.string(),
      })
      .array(),
  )

export const findById = orpcContract
  .route({ method: 'GET', path: '/ascents/{id}' })
  .input(ascentSchema.pick({ id: true }))
  .output(ascentSchema.or(z.undefined()))

export const create = orpcContract
  .route({ method: 'POST', path: '/ascents', successStatus: 201 })
  .input(ascentSchema.omit({ id: true }))
  .output(ascentSchema)
