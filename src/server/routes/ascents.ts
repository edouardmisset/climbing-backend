import { Hono } from 'hono'

import { validNumberWithFallback } from '@edouardmisset/math'
import { removeAccents } from '@edouardmisset/text'

import { ascentSchema, holdsSchema, profileSchema } from 'schema/ascent.ts'

import fuzzySort from 'fuzzysort'
import { groupSimilarStrings } from 'helpers/find-similar.ts'
import { describeRoute } from 'hono-openapi'
import { resolver, validator as zValidator } from 'hono-openapi/zod'
import { getAllAscents } from 'services/ascents.ts'
import { string, z } from 'zod'

// For extending the Zod schema with OpenAPI properties
import 'zod-openapi/extend'
import { filterAscents } from 'helpers/filter-ascents.ts'
import { sampleAscents } from 'backup/sample-ascents.ts'

const createAscentRoute = (fetchAscents = getAllAscents) =>
  new Hono().get(
    '/',
    describeRoute({
      description: 'Get all ascents',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  data: z.array(ascentSchema),
                }).openapi({
                  example: {
                    data: sampleAscents.slice(0, 5),
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
        climbingDiscipline: ascentSchema.shape.climbingDiscipline.optional(),
        crag: ascentSchema.shape.crag.optional(),
        grade: ascentSchema.shape.topoGrade.optional(),
        height: ascentSchema.shape.height.optional(),
        holds: holdsSchema.optional(),
        profile: profileSchema.optional(),
        style: ascentSchema.shape.style.optional(),
        tries: ascentSchema.shape.tries.optional(),
        year: z.number().optional(),
        rating: ascentSchema.shape.rating.optional(),
      })
        .optional().openapi({
          ref: 'query',
        }),
    ),
    async (c) => {
      const validatedQuery = c.req.valid('query') ?? {}

      const ascents = await fetchAscents()

      const filteredAscents = filterAscents(ascents, validatedQuery)

      const dateSortedAscents = filteredAscents
        .sort(
          (
            { date: leftDate },
            { date: rightDate },
          ) => {
            if (!leftDate || !rightDate || leftDate === rightDate) {
              return 0
            }

            return new Date(leftDate) > new Date(rightDate) ? 1 : -1
          },
        )

      return c.json({
        data: dateSortedAscents,
      })
    },
  )
    .get('/duplicates', async (c) => {
      const ascentMap = new Map()
      const ascents = await fetchAscents()

      ascents.forEach(
        ({ routeName, crag, topoGrade }) => {
          // We ignore the "+" in the topoGrade in case it was logged inconsistently
          const key = [routeName, topoGrade.replace('+', ''), crag].map((
            string,
          ) => removeAccents(string.toLocaleLowerCase())).join('-')

          ascentMap.set(key, (ascentMap.get(key) || 0) + 1)
        },
      )

      const duplicateRoutes = Array.from(ascentMap.entries())
        .filter(([, count]) => count > 1)
        .map(([key]) => key)

      return c.json({ data: duplicateRoutes })
    })
    .get('/similar', async (c) => {
      const ascents = await fetchAscents()
      const similarAscents = Array.from(
        groupSimilarStrings(
          ascents.map(({ routeName }) => routeName),
          2,
        )
          .entries(),
      )

      return c.json({ data: similarAscents })
    })
    .get(
      '/search',
      zValidator(
        'query',
        z.object({
          query: string(),
          limit: z.string().optional().transform((val) =>
            validNumberWithFallback(val, 100)
          ),
        }),
      ),
      async (c) => {
        const { query, limit } = c.req.valid('query')

        const results = fuzzySort.go(
          removeAccents(query),
          await getAllAscents(),
          {
            key: ({ routeName }) => routeName,
            limit,
            threshold: 0.7,
          },
        )

        return c.json({
          data: results.map((result) => ({
            highlight: result.highlight(),
            target: result.target,
            ...result.obj,
          })),
          metadata: {
            query,
            limit,
            results: results.total,
          },
        })
      },
    )

export { createAscentRoute }
