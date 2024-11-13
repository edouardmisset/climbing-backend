import { Hono } from 'hono'

import { frequency } from '@edouardmisset/array'
import { average } from '@edouardmisset/math/average.ts'
import {
  convertGradeToNumber,
  convertNumberToGrade,
} from 'helpers/converters.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import { type Ascent, ascentSchema, type Grade } from 'schema/ascent.ts'
import { getAllAscents } from 'services/ascents.ts'
import { z } from 'zod'
import { zValidator } from 'zod-validator'

const gradesQuerySchema = z.object({
  ['climbing-discipline']: ascentSchema.shape.climbingDiscipline.optional(),
  year: z.string().transform(Number).optional(),
})

/** Helper function to filter ascents by climbing discipline and year */
function filterAscents(
  ascents: Ascent[],
  climbingDiscipline?: Ascent['climbingDiscipline'],
  year?: number,
): Ascent[] {
  return ascents
    .filter((ascent) =>
      climbingDiscipline === undefined
        ? true
        : ascent.climbingDiscipline === climbingDiscipline
    )
    .filter((ascent) =>
      year === undefined ? true : new Date(ascent.date).getFullYear() === year
    )
}

export const grades = new Hono().get(
  '/',
  zValidator('query', gradesQuerySchema),
  async (c) => {
    const {
      'climbing-discipline': climbingDiscipline,
      year,
    } = c.req.valid('query')

    const ascents = await getAllAscents()

    const filteredGrades = filterAscents(ascents, climbingDiscipline, year)
      .map(({ topoGrade }) => topoGrade)

    const sortedGrades = [...new Set(filteredGrades)].sort()

    return c.json({ data: sortedGrades })
  },
)
  .get('/frequency', zValidator('query', gradesQuerySchema), async (c) => {
    const {
      'climbing-discipline': climbingDiscipline,
      year,
    } = c.req.valid('query')

    const ascents = await getAllAscents()

    const filteredGrades = filterAscents(ascents, climbingDiscipline, year)
      .map(({ topoGrade }) => topoGrade)

    const sortedGradesByFrequency = sortKeys(
      frequency(filteredGrades),
      true,
    )

    return c.json({ data: sortedGradesByFrequency })
  })
  .get('/average', zValidator('query', gradesQuerySchema), async (c) => {
    const {
      'climbing-discipline': climbingDiscipline,
      year,
    } = c.req.valid('query')

    const ascents = await getAllAscents()

    const filteredNumberGrades = filterAscents(
      ascents,
      climbingDiscipline,
      year,
    )
      .map(({ topoGrade }) => convertGradeToNumber(topoGrade as Grade))

    const averageGrade = convertNumberToGrade(
      Math.round(average(filteredNumberGrades)),
    )

    return c.json({ data: averageGrade })
  })
