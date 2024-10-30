import { Hono } from 'hono'

import {
  frequency,
  mapObject,
  stringEqualsCaseInsensitive,
} from '@edouardmisset/utils'
import {
  convertGradeToNumber,
  ROUTE_GRADE_TO_NUMBER,
} from 'helpers/converters.ts'
import { findSimilar, groupSimilarStrings } from 'helpers/find-similar.ts'
import { sortNumericalValues } from 'helpers/sort-values.ts'
import { type Ascent, Grade } from 'schema/ascent.ts'
import { getAllAscents } from 'services/ascents.ts'
import { z } from 'zod'
import { zValidator } from 'zod-validator'

const hightestGradeNumber = [...ROUTE_GRADE_TO_NUMBER.values()].at(-1) ?? 1

export const crags = new Hono().get('/', async (c) => {
  const validCrags = await getValidCrags()

  const sortedCrags = [...new Set(validCrags)].sort()

  return c.json({ data: sortedCrags })
})
  .get('/frequency', async (c) => {
    const validCrags = await getValidCrags()

    const sortedCragsByFrequency = sortNumericalValues(
      frequency(validCrags),
      false,
    )

    return c.json({ data: sortedCragsByFrequency })
  })
  .get(
    '/most-successful',
    zValidator(
      'query',
      z.object({
        'weight-by-grade': z.enum(['true', 'false']).optional().transform((
          value,
        ) => value === 'true'),
      }),
    ),
    async (c) => {
      const weightedByGrade = c.req.valid('query')['weight-by-grade']

      const ascents = await getAllAscents()
      const validCrags = await getValidCrags()

      const weightedByGradeAndSortedCrags = [...new Set(validCrags)].reduce(
        (acc, crag) => {
          const listOfAscentsInCrag = ascents.filter((
            { crag: ascentCrag },
          ) => stringEqualsCaseInsensitive(crag, ascentCrag.trim()))

          const totalWeightedGrade = listOfAscentsInCrag.reduce(
            (acc, { topoGrade }) =>
              acc +
              (weightedByGrade
                ? convertGradeToNumber(topoGrade as Grade) / hightestGradeNumber
                : 1),
            0,
          )

          return {
            ...acc,
            [crag]: totalWeightedGrade,
          }
        },
        {} as Record<string, number>,
      )

      const sortedCragsByNumber = sortNumericalValues(
        weightedByGradeAndSortedCrags,
        false,
      )

      const mostSuccessfulCrags: Record<string, number> = Object.fromEntries(
        Object.entries(sortedCragsByNumber).map<[string, number]>(
          ([crag, number]) => {
            const daysClimbedInCrag = new Set(
              ascents.filter(({ crag: ascentCrag }) =>
                stringEqualsCaseInsensitive(crag, ascentCrag)
              ).map(({ date }) => date),
            ).size

            return [crag, number / daysClimbedInCrag]
          },
        ).sort(([, a], [, b]) => b - a),
      )

      const highestScore =
        mostSuccessfulCrags[Object.keys(mostSuccessfulCrags)[0]]

      return c.json({
        data: mapObject(
          mostSuccessfulCrags,
          (val) => Number((val / highestScore).toFixed(1)),
        ),
      })
    },
  )
  .get('/duplicates', async (c) => {
    const validCrags = await getValidCrags()

    const similarCrags = findSimilar(validCrags)

    return c.json({ data: similarCrags })
  })
  .get('/similar', async (c) => {
    const validCrags = await getValidCrags()
    const similarCrags = Array.from(
      groupSimilarStrings(validCrags, 2).entries(),
    )

    return c.json({ data: similarCrags })
  })

async function getValidCrags(): Promise<Ascent['crag'][]> {
  const ascents = await getAllAscents()
  return ascents.map(({ crag }) => crag.trim()).filter((crag) =>
    crag !== undefined
  )
}
