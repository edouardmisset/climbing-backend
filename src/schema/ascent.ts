import { number, string, z } from 'zod'

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

export type RouteGrade = `${Degree}${RouteGradeLetter}${OptionalPlus}`
export type BoulderGrade = Uppercase<RouteGrade>
export type Grade = RouteGrade | BoulderGrade

const routeFrenchGradeSchema = string().min(2).regex(/^\d{1}[a-c]\+?$/)
const boulderingFrenchGradeSchema = routeFrenchGradeSchema.toUpperCase()

const ascentStyle = ['Onsight', 'Flash', 'Redpoint'] as const
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

// For extending the Zod schema with OpenAPI properties
import 'zod-openapi/extend'

export const ascentSchema = z.object({
  area: string().or(number()).transform(String).optional().openapi({
    effectType: 'input',
    type: 'string',
  }),
  climber: string().optional().transform((_) => 'Edouard Misset').openapi({
    effectType: 'input',
    type: 'string',
  }),
  climbingDiscipline: climbingDisciplineSchema,
  comments: string().optional(),
  crag: string().min(1),
  date: string(), // ISO 8601 date format
  region: string().optional(),
  height: number().min(5).optional(),
  holds: holdsSchema.optional(),
  personalGrade: routeFrenchGradeSchema.or(boulderingFrenchGradeSchema)
    .optional(),
  profile: profileSchema.optional(),
  rating: number().min(0).max(5).optional(),
  routeName: string().min(1).or(number()).transform(String).openapi({
    effectType: 'input',
    type: 'string',
  }),
  style: z.enum(ascentStyle),
  topoGrade: routeFrenchGradeSchema.or(boulderingFrenchGradeSchema),
  tries: number().min(1),
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
    year: number().optional(),
    rating: ascentSchema.shape.rating.optional(),
  })
  .optional()
export type OptionalAscentFilter = z.infer<typeof optionalAscentFilterSchema>
