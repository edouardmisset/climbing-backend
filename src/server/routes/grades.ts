import { frequency } from '@edouardmisset/array'
import { average } from '@edouardmisset/math/average.ts'
import {
  convertGradeToNumber,
  convertNumberToGrade,
} from 'helpers/converters.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
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
  describeRoute({
    description: 'Get all climbing grades',
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
                  data: ['7a', '7a+', '7b', '7c'],
                },
              }),
            ),
          },
        },
      },
    },
  }),
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
  .get(
    '/frequency',
    describeRoute({
      description: 'Get frequency distribution of climbing grades',
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
                      '7a': 35,
                      '7a+': 25,
                      '7b': 15,
                      '7c': 5,
                    },
                  },
                }),
              ),
            },
          },
        },
      },
    }),
    gradesQueryValidator,
    async (c) => {
      const {
        'climbing-discipline': climbingDiscipline,
        year,
      } = c.req.valid('query') ?? {}

      const filteredGrades =
        (await getFilteredAscents(climbingDiscipline, year))
          .map(({ topoGrade }) => topoGrade)

      const sortedGradesByFrequency = sortKeys(
        frequency(filteredGrades),
        true,
      )

      return c.json({ data: sortedGradesByFrequency })
    },
  )
  .get(
    '/average',
    describeRoute({
      description: 'Calculate the average climbing grade',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  data: ascentSchema.shape.topoGrade,
                }).openapi({
                  example: {
                    data: '7a+',
                  },
                }),
              ),
            },
          },
        },
      },
    }),
    gradesQueryValidator,
    async (c) => {
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
    },
  )
