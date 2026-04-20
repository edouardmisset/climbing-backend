import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'

export const list = orpcContract
  .route({ method: 'GET', path: '/areas' })
  .output(z.string().array())

export const frequency = orpcContract
  .route({ method: 'GET', path: '/areas/frequency' })
  .output(z.record(z.string(), z.number()))

export const duplicates = orpcContract
  .route({ method: 'GET', path: '/areas/duplicates' })
  .output(z.array(z.record(z.string(), z.array(z.string()))))

export const similar = orpcContract
  .route({ method: 'GET', path: '/areas/similar' })
  .output(z.record(z.string(), z.array(z.string())))
