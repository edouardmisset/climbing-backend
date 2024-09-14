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

export const ascentSchema = z.object({
  date: string(),
  routeName: string().min(1).or(number()).transform(String),
  topoGrade: routeFrenchGradeSchema.or(boulderingFrenchGradeSchema),
  routeOrBoulder: z.enum(['Route', 'Boulder']),
  comments: string().optional(),
  personalGrade: routeFrenchGradeSchema.or(boulderingFrenchGradeSchema)
    .optional(),
  height: number().optional(),
  tries: number(),
  profile: string(),
  holds: string(),
  rating: number().optional(),
  crag: string(),
  area: string().optional(),
  departement: string().optional(),
  climber: z.literal('Edouard Misset'),
}).passthrough()
export type Ascent = z.infer<typeof ascentSchema>
