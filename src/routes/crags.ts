import { Hono } from 'hono'

import ascentJSON from '@data/ascent-data.json' with { type: 'json' }
import { ascentSchema, Grade } from '@schema/ascent.ts'
import { etag } from 'hono/etag'
import {
  frequency,
  mapObject,
  stringEqualsCaseInsensitive,
} from '@edouardmisset/utils'
import {
  convertGradeToNumber,
  ROUTE_GRADE_TO_NUMBER,
} from '@helpers/converters.ts'
import { findSimilar, groupSimilarStrings } from '@helpers/find-similar.ts'
import { sortNumericalValues } from '@helpers/sort-values.ts'
import { zValidator } from 'zod-validator'
import { z } from 'zod'

const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const app = new Hono()
app.use(etag())

const validCrags = parsedAscents.map(({ crag }) => crag.trim()).filter(crag => crag !== undefined)

// Get all known crags from the ascents
app.get('/', (ctx) => {
  const crags = [...new Set(validCrags)]
    .sort()

  return ctx.json({ data: crags })
})

// Get crags frequency
app.get('/frequency', (ctx) => {
  const sortedCragsByFrequency = sortNumericalValues(
    frequency(validCrags),
    false,
  )

  return ctx.json({ data: sortedCragsByFrequency })
})

const hightestGradeNumber = [...ROUTE_GRADE_TO_NUMBER.values()].at(-1) ?? 1

app.get(
  '/most-successful',
  zValidator(
    'query',
    z.object({
      'weight-by-grade': z.enum(['true', 'false']).optional().transform((
        value,
      ) => value === 'true'),
    }),
  ),
  (ctx) => {
    const weightedByGrade = ctx.req.valid('query')['weight-by-grade']

    const weightedByGradeAndSortedCrags = [...new Set(validCrags)].reduce(
      (acc, crag) => {
        const listOfAscentsInCrag = parsedAscents.filter((
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
            parsedAscents.filter(({ crag: ascentCrag }) =>
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

app.get('/duplicates', (ctx) => {
  const similarCrags = findSimilar(validCrags)

  return ctx.json({ data: similarCrags })
})

// Similar crag names
app.get('/similar', (ctx) => {
  const similarCrags = Array.from(groupSimilarStrings(validCrags, 2).entries())

  return ctx.json({ data: similarCrags })
})

export default app
