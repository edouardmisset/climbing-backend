import { number, string, z } from 'zod'

const sessionTypeSchema = z.enum([
  'En',
  'PE',
  'SE',
  'MS',
  'Ex',
  'Po',
  'Ta',
  'Ro',
  'St',
  'Sk',
  'Sg',
  'Co',
  'CS',
  'FB',
])

const percentSchema = number().min(0).max(100)

export const trainingSessionSchema = z.object({
  date: string(),
  sessionType: sessionTypeSchema.optional(),
  volume: percentSchema.optional(),
  anatomicalRegion: z.enum(['Ar', 'Fi', 'Ge']).optional(),
  energySystem: z.enum(['AA', 'AL', 'AE']).optional(),
  routeOrBouldering: z.enum(['Route', 'Bouldering', 'Multi-Pitch']).optional(),
  gymCrag: string().optional(),
  comments: string().optional(),
  intensity: percentSchema.optional(),
  load: percentSchema.optional(),
})
export type TrainingSession = z.infer<typeof trainingSessionSchema>
