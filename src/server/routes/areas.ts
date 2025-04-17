import { frequency } from '@edouardmisset/array'
import { findSimilar, groupSimilarStrings } from 'helpers/find-similar.ts'
import { sortNumericalValues } from 'helpers/sort-values.ts'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import type { Ascent } from 'schema/ascent.ts'
import { getAllAscents } from 'services/ascents.ts'
import { z } from 'zod'

async function getValidAreas(): Promise<NonNullable<Ascent['area']>[]> {
  const ascents = await getAllAscents()
  return ascents.map(({ area }) => area?.trim()).filter(
    (area) => area !== undefined,
  )
}

// Get all known areas from the ascents
export const areas = new Hono().get(
  '/',
  describeRoute({
    description: 'Get all climbing areas',
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
                  data: ['Fontainebleau', 'Frankenjura', 'Gorges du Loup'],
                },
              }),
            ),
          },
        },
      },
    },
  }),
  async (c) => {
    const validAreas = await getValidAreas()
    const sortedAreas = [...new Set(validAreas)].sort()

    return c.json({ data: sortedAreas })
  },
)
  .get(
    '/frequency',
    describeRoute({
      description: 'Get frequency distribution of climbing areas',
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
                      Fontainebleau: 15,
                      Frankenjura: 7,
                      'Gorges du Loup': 12,
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
      const validAreas = await getValidAreas()
      const sortedAreasByFrequency = sortNumericalValues(
        frequency(validAreas),
        false,
      )
      return c.json({ data: sortedAreasByFrequency })
    },
  )
  .get(
    '/duplicates',
    describeRoute({
      description: 'Find potential duplicate area entries',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  data: z.array(z.record(z.string(), z.array(z.string()))),
                }).openapi({
                  example: {
                    data: [
                      { Fontainebleau: ['Fontainbleu', 'Fontainebleu'] },
                      { 'Gorges du Loup': ['Gorge du Loup', 'Gorges de Loup'] },
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
      const validAreas = await getValidAreas()
      const duplicateAreas = findSimilar(validAreas)

      return c.json({ data: duplicateAreas })
    },
  )
  .get(
    '/similar',
    describeRoute({
      description:
        'Find areas with similar names to identify potential duplicates',
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
                      ['Fontainebleau', ['Fontainbleu', 'Fontainebleu']],
                      ['Gorges du Loup', ['Gorge du Loup', 'Gorges de Loup']],
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
      const validAreas = await getValidAreas()
      const similarAreas = Array.from(
        groupSimilarStrings(validAreas, 3).entries(),
      )

      return c.json({ data: similarAreas })
    },
  )
