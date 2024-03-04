import { string, z } from 'zod'
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

const routeFrenchGradeSchema = z.string().min(2).regex(/^\d{1}[a-c]\+?$/)
const boulderingFrenchGradeSchema = routeFrenchGradeSchema.toUpperCase()

export const ascentSchema = z.object({
  date: frenchDateSchema.or(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform((date) => {
      const [year, month, day] = date.split('-').map(Number)
      return new Date(
        year,
        month - 1,
        day,
      ).toISOString()
    }),
  ),
  routeName: z.string().min(1),
  topoGrade: (routeFrenchGradeSchema.or(boulderingFrenchGradeSchema)),
  routeOrBoulder: z.enum(['Route', 'Boulder', 'Multi-Pitch']),
  comments: z.string(),
  myGrade: routeFrenchGradeSchema.or(boulderingFrenchGradeSchema).or(
    z.literal(''),
  ),
  height: z.string(),
  tries: z.string(),
  profile: z.string(),
  holds: z.string(),
  rating: string(),
  crag: z.string(),
  area: z.string(),
  departement: z.string(),
  climber: z.literal('Edouard Misset'),
}).passthrough()
export type Ascent = z.infer<typeof ascentSchema>
