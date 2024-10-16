import { Hono } from 'hono'

import {
  frequency,
  mapObject,
  stringEqualsCaseInsensitive,
} from '@edouardmisset/utils'
import { getAscents } from 'data/ascent-data.ts'
import {
  convertGradeToNumber,
  ROUTE_GRADE_TO_NUMBER,
} from 'helpers/converters.ts'
import { findSimilar, groupSimilarStrings } from 'helpers/find-similar.ts'
import { sortNumericalValues } from 'helpers/sort-values.ts'
import { etag } from 'hono/etag'
import { type Ascent, Grade } from 'schema/ascent.ts'
import { z } from 'zod'
import { zValidator } from 'zod-validator'

const crags = new Hono()
crags.use(etag())

const hightestGradeNumber = [...ROUTE_GRADE_TO_NUMBER.values()].at(-1) ?? 1

// Get all known crags from the ascents
crags.get('/', async (ctx) => {
  const validCrags = await getValidCrags()

  const crags = [...new Set(validCrags)].sort()

  return ctx.json({ data: crags })
})
  // Get crags frequency
  .get('/frequency', async (ctx) => {
    const validCrags = await getValidCrags()

    const sortedCragsByFrequency = sortNumericalValues(
      frequency(validCrags),
      false,
    )

    return ctx.json({ data: sortedCragsByFrequency })
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
    async (ctx) => {
      const weightedByGrade = ctx.req.valid('query')['weight-by-grade']

      const ascents = await getAscents()
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

      return ctx.json({
        data: mapObject(
          mostSuccessfulCrags,
          (val) => Number((val / highestScore).toFixed(1)),
        ),
      })
    },
  )
  .get('/duplicates', async (ctx) => {
    const validCrags = await getValidCrags()

    const similarCrags = findSimilar(validCrags)

    return ctx.json({ data: similarCrags })
  })
  .get('/similar', async (ctx) => {
    const validCrags = await getValidCrags()
    const similarCrags = Array.from(
      groupSimilarStrings(validCrags, 2).entries(),
    )

    return ctx.json({ data: similarCrags })
  })

export default crags

async function getValidCrags(): Promise<Ascent['crag'][]> {
  const ascents = await getAscents()
  return ascents.map(({ crag }) => crag.trim()).filter((crag) =>
    crag !== undefined
  )
}
