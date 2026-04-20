import { z } from 'zod'
import { yearSchema } from './generics.ts'

const degrees = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
export const degreeSchema = z.enum(degrees)

type Degree = z.infer<typeof degreeSchema>

export const ROUTE_LETTERS = ['a', 'b', 'c'] as const
const routeGradeLetterSchema = z.enum(ROUTE_LETTERS)

type RouteGradeLetter = z.infer<typeof routeGradeLetterSchema>
export type BoulderGradeLetter = Uppercase<RouteGradeLetter>

export const optionalPlus = ['', '+'] as const
const optionalPlusSchema = z.enum(optionalPlus)
type OptionalPlus = z.infer<typeof optionalPlusSchema>

export type Grade = `${Degree}${RouteGradeLetter}${OptionalPlus}`

export const _GRADES = [
  '1a',
  '1a+',
  '1b',
  '1b+',
  '1c',
  '1c+',

  '2a',
  '2a+',
  '2b',
  '2b+',
  '2c',
  '2c+',

  '3a',
  '3a+',
  '3b',
  '3b+',
  '3c',
  '3c+',

  '4a',
  '4a+',
  '4b',
  '4b+',
  '4c',
  '4c+',

  '5a',
  '5a+',
  '5b',
  '5b+',
  '5c',
  '5c+',

  '6a',
  '6a+',
  '6b',
  '6b+',
  '6c',
  '6c+',

  '7a',
  '7a+',
  '7b',
  '7b+',
  '7c',
  '7c+',

  '8a',
  '8a+',
  '8b',
  '8b+',
  '8c',
  '8c+',

  '9a',
  '9a+',
  '9b',
  '9b+',
  '9c',
  '9c+',
] as const

export const gradeSchema = z.enum(_GRADES)

const ascentStyle = ['Onsight', 'Flash', 'Redpoint'] as const
export const ascentStyleSchema = z.enum(ascentStyle)
export const climbingDisciplineSchema = z.enum([
  'Route',
  'Boulder',
  'Multi-Pitch',
])

export const holdsFromGS = [
  'Positive',
  'Jug',
  'Sloper',
  'Pocket',
  'Pinch',
  'Crimp',
  'Volume',
  'Crack',
  'Bi',
  'Mono',
  'Various',
  'Undercling',
] as const

/**
 * 'Mono' and 'Bi' hold types from Google Sheets' model are really only pockets.
 *
 * 'Various' was a catch-all for holds that don't fit in the other categories,
 * but it's not very useful. It is likely to be crimpy holds.
 *
 * 'Positive' and Volume are a hold type that don't really exist in outdoor climbing.
 */
export const holds = [
  'Jug',
  'Sloper',
  'Pocket',
  'Pinch',
  'Crimp',
  'Crack',
  'Undercling',
] as const

const profiles = [
  'Dihedral',
  'Slab',
  'Vertical',
  'Overhang',
  'Arête',
  'Traverse',
  'Roof',
] as const

export const profileSchema = z.enum(profiles)
export const holdsFomGSSchema = z.enum(holdsFromGS)
export const holdsSchema = z.enum(holds)

export const ascentSchema = z.object({
  area: z.string().or(z.number()).transform(String).optional(),
  climber: z.string().optional().default('Edouard Misset'),
  climbingDiscipline: climbingDisciplineSchema,
  comments: z.string().max(10_000).optional(),
  crag: z.string().min(1),
  date: z.string(), // ISO 8601 date format
  region: z.string().optional(),
  height: z.number().int().min(5).max(1_000).optional(),
  holds: holdsSchema.optional(),
  personalGrade: gradeSchema
    .optional(),
  profile: profileSchema.optional(),
  rating: z.number().int().min(0).max(5).optional(),
  routeName: z.string().min(1).or(z.number()).transform(String),
  style: ascentStyleSchema,
  topoGrade: gradeSchema,
  tries: z.number().int().min(1),
  id: z.number().int().min(0),
})
export type Ascent = z.infer<typeof ascentSchema>

export const optionalAscentFilterSchema = z
  .object({
    climbingDiscipline: climbingDisciplineSchema.optional(),
    crag: ascentSchema.shape.crag.optional(),
    grade: ascentSchema.shape.topoGrade.optional(),
    height: ascentSchema.shape.height.optional(),
    holds: holdsSchema.optional(),
    profile: profileSchema.optional(),
    style: ascentSchema.shape.style.optional(),
    tries: ascentSchema.shape.tries.optional(),
    year: yearSchema.optional(),
    rating: ascentSchema.shape.rating.optional(),
  })
  .optional()
export type OptionalAscentFilter = z.infer<typeof optionalAscentFilterSchema>
