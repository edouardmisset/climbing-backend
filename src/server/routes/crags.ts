import { frequency } from '@edouardmisset/array'
import { mapObject } from '@edouardmisset/object'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import {
  convertGradeToNumber,
  ROUTE_GRADE_TO_NUMBER,
} from 'helpers/converters.ts'
import { findSimilar, groupSimilarStrings } from 'helpers/find-similar.ts'
import { sortNumericalValues } from 'helpers/sort-values.ts'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import { type Ascent, Grade } from 'schema/ascent.ts'
import { getAllAscents } from 'services/ascents.ts'
import { z } from 'zod'
import { zValidator } from 'zod-validator'

const hightestGradeNumber = [...ROUTE_GRADE_TO_NUMBER.values()].at(-1) ?? 1

export const crags = new Hono().get(
  '/',
  describeRoute({
    description: 'Get all climbing crags',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: resolver(
              z.object({
                data: z.array(z.string()),
              }).openapi({
                example: {
                  data: ['Ceuse', 'Cuvier', 'Ewige Jagdgründe'],
                },
              }),
            ),
          },
        },
      },
    },
  }),
  async (c) => {
    const validCrags = await getValidCrags()

    const sortedCrags = [...new Set(validCrags)].sort()

    return c.json({ data: sortedCrags })
  },
)
  .get(
    '/frequency',
    describeRoute({
      description: 'Get frequency distribution of climbing crags',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  data: z.record(z.string(), z.number()),
                }).openapi({
                  example: {
                    data: {
                      'Ceuse': 5,
                      'Cuvier': 10,
                      'Ewige Jagdgründe': 3,
                    },
                  },
                }),
              ),
            },
          },
        },
      },
    }),
    async (c) => {
      const validCrags = await getValidCrags()

      const sortedCragsByFrequency = sortNumericalValues(
        frequency(validCrags),
        false,
      )

      return c.json({ data: sortedCragsByFrequency })
    },
  )
  .get(
    '/most-successful',
    describeRoute({
      description:
        'Calculate most successful crags based on number of ascents and optionally weighted by grade difficulty',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  data: z.record(z.string(), z.number()),
                }).openapi({
                  example: {
                    data: {
                      'Ceuse': 1.0,
                      'Cuvier': 0.8,
                      'Ewige Jagdgründe': 0.6,
                    },
                  },
                }),
              ),
            },
          },
        },
      },
    }),
    zValidator(
      'query',
      z.object({
        'weight-by-grade': z.enum(['true', 'false']).optional().transform((
          value,
        ) => value === 'true'),
      }),
    ),
    async (c) => {
      const { 'weight-by-grade': weightedByGrade } = c.req.valid('query')

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
  .get(
    '/duplicates',
    describeRoute({
      description: 'Find potential duplicate crag entries',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  data: z.array(z.string()),
                }).openapi({
                  example: {
                    data: ['cuvier', 'ewige jagdgrunde'],
                  },
                }),
              ),
            },
          },
        },
      },
    }),
    async (c) => {
      const validCrags = await getValidCrags()

      const similarCrags = findSimilar(validCrags)

      return c.json({ data: similarCrags })
    },
  )
  .get(
    '/similar',
    describeRoute({
      description:
        'Find crags with similar names to identify potential duplicates',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  data: z.array(z.tuple([
                    z.string(),
                    z.array(z.string()),
                  ])),
                }).openapi({
                  example: {
                    data: [
                      ['Cuvier', ['Cuvier Rempart', 'Petit Cuvier']],
                      ['Ewige Jagdgründe', ['Ewige Jagdgrunde']],
                    ],
                  },
                }),
              ),
            },
          },
        },
      },
    }),
    async (c) => {
      const validCrags = await getValidCrags()
      const similarCrags = Array.from(
        groupSimilarStrings(validCrags, 2).entries(),
      )

      return c.json({ data: similarCrags })
    },
  )

async function getValidCrags(): Promise<Ascent['crag'][]> {
  const ascents = await getAllAscents()
  return ascents.map(({ crag }) => crag.trim()).filter((crag) =>
    crag !== undefined
  )
}
