import { validNumberWithFallback } from '@edouardmisset/math'
import { removeAccents } from '@edouardmisset/text'
import fuzzySort from 'fuzzysort'
import { groupSimilarStrings } from 'helpers/find-similar.ts'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver, validator as zValidator } from 'hono-openapi/zod'
import { ascentSchema, holdsSchema, profileSchema } from 'schema/ascent.ts'
import { getAllAscents } from 'services/ascents.ts'
import { string, z } from 'zod'

// For extending the Zod schema with OpenAPI properties
import { sampleAscents } from 'backup/sample-ascents.ts'
import { filterAscents } from 'helpers/filter-ascents.ts'
import 'zod-openapi/extend'

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
    .get(
      '/duplicates',
      describeRoute({
        description: 'Find potential duplicate ascent entries',
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
                      data: [
                        'black-knight-7a-ewige-jagdgrunde',
                        'superplafond-6c-gorges-du-loup',
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
        const ascentMap = new Map<string, number>()
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
      },
    )
    .get(
      '/similar',
      describeRoute({
        description:
          'Find routes with similar names to identify potential duplicates',
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
                        ['Black Knight', ['Black Night', 'Black Knigh']],
                        ['Superplafond', ['Super plafond', 'Super-plafond']],
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
        const ascents = await fetchAscents()
        const similarAscents = Array.from(
          groupSimilarStrings(
            ascents.map(({ routeName }) => routeName),
            2,
          )
            .entries(),
        )

        return c.json({ data: similarAscents })
      },
    )
    .get(
      '/search',
      describeRoute({
        description: 'Search for a specific ascent',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: resolver(
                  z.object({
                    data: z.array(
                      ascentSchema.extend({
                        target: z.string(),
                        highlight: z.string(),
                      }),
                    ),
                    metadata: z.object({
                      query: z.string(),
                      limit: z.string().optional().transform((val) =>
                        validNumberWithFallback(val, 100)
                      ).openapi({
                        effectType: 'input',
                        type: 'number',
                      }),
                      results: z.number(),
                    }),
                  }).openapi({
                    example: {
                      data: [{
                        area: 'Wig Wam',
                        climber: 'Edouard Misset',
                        climbingDiscipline: 'Route',
                        comments:
                          'À la fois superbe grimpe et passage terrifiant.',
                        crag: 'Ewige Jagdgründe',
                        date: '2024-10-27T12:00:00.000Z',
                        height: 25,
                        holds: 'Crimp',
                        personalGrade: '6c+',
                        profile: 'Arête',
                        rating: 4,
                        routeName: 'Black Knight',
                        style: 'Onsight',
                        topoGrade: '7a',
                        tries: 1,
                        target: 'Black Knight',
                        highlight: 'black',
                      }],
                      metadata: {
                        query: 'black',
                        limit: undefined,
                        results: 1,
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
            ...result.obj,
            highlight: result.highlight(),
            target: result.target,
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
