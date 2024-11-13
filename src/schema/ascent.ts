import { number, string, z } from 'zod'

const degrees = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
const degreeSchema = z.enum(degrees)

type Degree = z.infer<typeof degreeSchema>

const ROUTE_LETTERS = ['a', 'b', 'c'] as const
const routeGradeLetterSchema = z.enum(ROUTE_LETTERS)

type RouteGradeLetter = z.infer<typeof routeGradeLetterSchema>
type BoulderGradeLetter = Uppercase<RouteGradeLetter>

const optionalPlus = ['', '+'] as const
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

const holds = [
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
export const holdsSchema = z.enum(holds)

export const ascentSchema = z.object({
  area: string().or(number()).transform(String).optional(),
  climber: string().optional().transform((_) => 'Edouard Misset'),
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
  routeName: string().min(1).or(number()).transform(String),
  style: z.enum(ascentStyle),
  topoGrade: routeFrenchGradeSchema.or(boulderingFrenchGradeSchema),
  tries: number().min(1),
})
export type Ascent = z.infer<typeof ascentSchema>
