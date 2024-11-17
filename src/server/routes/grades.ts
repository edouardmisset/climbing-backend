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

const gradesQueryValidator = zValidator(
  'query',
  z.object({
    ['climbing-discipline']: ascentSchema.shape.climbingDiscipline.optional(),
    year: z.string().transform(Number).optional(),
  }).optional(),
)

async function getFilteredAscents(
  climbingDiscipline?: Ascent['climbingDiscipline'],
  year?: number,
): Promise<Ascent[]> {
  const ascents = await getAllAscents()

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
  gradesQueryValidator,
  async (c) => {
    const {
      'climbing-discipline': climbingDiscipline,
      year,
    } = c.req.valid('query') ?? {}

    const filteredGrades = (await getFilteredAscents(climbingDiscipline, year))
      .map(({ topoGrade }) => topoGrade)

    const sortedGrades = [...new Set(filteredGrades)].sort()

    return c.json({ data: sortedGrades })
  },
)
  .get('/frequency', gradesQueryValidator, async (c) => {
    const {
      'climbing-discipline': climbingDiscipline,
      year,
    } = c.req.valid('query') ?? {}

    const filteredGrades = (await getFilteredAscents(climbingDiscipline, year))
      .map(({ topoGrade }) => topoGrade)

    const sortedGradesByFrequency = sortKeys(
      frequency(filteredGrades),
      true,
    )

    return c.json({ data: sortedGradesByFrequency })
  })
  .get('/average', gradesQueryValidator, async (c) => {
    const {
      'climbing-discipline': climbingDiscipline,
      year,
    } = c.req.valid('query') ?? {}

    const filteredNumberGrades =
      (await getFilteredAscents(climbingDiscipline, year))
        .map(({ topoGrade }) => convertGradeToNumber(topoGrade as Grade))

    const averageGrade = convertNumberToGrade(
      Math.round(average(filteredNumberGrades)),
    )

    return c.json({ data: averageGrade })
  })
