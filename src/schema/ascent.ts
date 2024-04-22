import { number, string, z } from 'zod'
import { frenchDateSchema } from './training.ts'

const degrees = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const
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
type Grade = RouteGrade | BoulderGrade

const routeFrenchGradeSchema = string().min(2).regex(/^\d{1}[a-c]\+?$/)
const boulderingFrenchGradeSchema = routeFrenchGradeSchema.toUpperCase()

export const ascentSchema = z.object({
  date: frenchDateSchema.or(
    string().regex(/^\d{2}-\d{2}-\d{4}$/).transform((date) => {
      const [day, month, year] = date.split('-').map(Number)
      return new Date(
        year,
        month - 1,
        day,
      ).toISOString()
    }),
  ),
  routeName: string().min(1).or(number()).transform(String),
  topoGrade: (routeFrenchGradeSchema.or(boulderingFrenchGradeSchema)),
  routeOrBoulder: z.enum(['Route', 'Boulder', 'Multi-Pitch']),
  comments: string().optional(),
  myGrade: routeFrenchGradeSchema.or(boulderingFrenchGradeSchema).optional(),
  height: string().optional(),
  tries: string(),
  profile: string(),
  holds: string(),
  rating: string(),
  crag: string(),
  area: string().or(number()).transform(String).optional(),
  departement: string(),
  climber: z.literal('Edouard Misset'),
}).passthrough()
export type Ascent = z.infer<typeof ascentSchema>
