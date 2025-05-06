import { z } from 'zod'
import { climbingDisciplineSchema } from './ascent.ts'

const sessionTypeSchema = z.enum([
  'En',
  'PE',
  'SE',
  'MS',
  'Out',
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

const percentSchema = z.number().min(0).max(100)

const anatomicalRegion = ['Ar', 'Fi', 'Ge'] as const
const energySystem = ['AA', 'AL', 'AE'] as const

export const trainingSessionSchema = z.object({
  id: z.number().int().min(0),
  anatomicalRegion: z.enum(anatomicalRegion).optional(),
  climbingDiscipline: climbingDisciplineSchema.optional(),
  comments: z.string().optional(),
  date: z.string(),
  energySystem: z.enum(energySystem).optional(),
  gymCrag: z.string().optional(),
  intensity: percentSchema.optional(),
  load: percentSchema.optional(),
  sessionType: sessionTypeSchema.optional(),
  volume: percentSchema.optional(),
})
export type TrainingSession = z.infer<typeof trainingSessionSchema>
