import { z } from 'zod'

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
type Grade = RouteGrade | BoulderGrade

interface CreateFrenchGradingScaleParams {
  minDegree: number
  maxDegree: number
  isBoulderGrade?: boolean
}

const createFrenchGradingScale = <GradeType extends Grade>(
  params: CreateFrenchGradingScaleParams,
) => {
  const { minDegree, maxDegree, isBoulderGrade = false } = params

  if (minDegree > maxDegree) throw new Error('Min cannot be greater than max')

  const min = degreeSchema.parse(minDegree.toString())
  const max = degreeSchema.parse(maxDegree.toString())

  const scale = Array.from(
    { length: Number(max) - Number(min) + 1 },
    (_, i) => degreeSchema.parse((i + Number(min)).toString()),
  )

  return scale.flatMap((degree) =>
    ROUTE_LETTERS.map(
      (letter) =>
        degree +
        (isBoulderGrade
          ? (letter.toUpperCase() as BoulderGradeLetter)
          : letter),
    ).flatMap((degreeAndLetter) =>
      optionalPlus.map((maybePlus) =>
        (degreeAndLetter + maybePlus) as GradeType
      )
    )
  )
}

const ROUTE_GRADES = createFrenchGradingScale<RouteGrade>({
  minDegree: 4,
  maxDegree: 9,
})
const BOULDER_GRADES = createFrenchGradingScale<BoulderGrade>({
  minDegree: 4,
  maxDegree: 8,
  isBoulderGrade: true,
})

const createGradeToNumberMap = <GradeType extends Grade>(
  grades: GradeType[],
): Map<GradeType, number> =>
  new Map(grades.map((grade, index) => [grade, index + 1]))

const invertMapKeyValue = <GradeType extends Grade, Value extends number>(
  map: Map<GradeType, Value>,
): Map<Value, GradeType> =>
  new Map([...map].map<[Value, GradeType]>(([grade, value]) => [value, grade]))

export const ROUTE_GRADE_TO_NUMBER = createGradeToNumberMap(ROUTE_GRADES)
export const BOULDER_GRADE_TO_NUMBER = createGradeToNumberMap(BOULDER_GRADES)

export const NUMBER_TO_ROUTE_GRADE = invertMapKeyValue(ROUTE_GRADE_TO_NUMBER)
export const NUMBER_TO_BOULDER_GRADE = invertMapKeyValue(
  BOULDER_GRADE_TO_NUMBER,
)

export const convertGradeToNumber = <GradeType extends Grade>(
  grade: GradeType,
): number =>
  ROUTE_GRADES.includes(grade as RouteGrade)
    ? ROUTE_GRADE_TO_NUMBER.get(grade as RouteGrade) ?? 0
    : BOULDER_GRADE_TO_NUMBER.get(grade as BoulderGrade) ?? 0

export const convertNumberToGrade = (
  gradeNumber: number,
  toBoulderGrade = false,
): Grade =>
  toBoulderGrade
    ? NUMBER_TO_BOULDER_GRADE.get(gradeNumber) ?? '1A'
    : NUMBER_TO_ROUTE_GRADE.get(gradeNumber) ?? '1a'
