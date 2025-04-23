import { validNumberWithFallback } from '@edouardmisset/math'
import { removeAccents } from '@edouardmisset/text'
import fuzzySort from 'fuzzysort'
import { z } from 'zod'
import {
  type Ascent,
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
  holdsSchema,
  profileSchema,
} from 'schema/ascent.ts'
import { addAscent, getAllAscents } from 'services/ascents.ts'
import { oc as orpcContract } from '@orpc/contract'
import { filterAscents } from 'helpers/filter-ascents.ts'
import { implement } from '@orpc/server'

export async function getFilteredAscents(
  filters?: OptionalAscentFilter,
): Promise<Ascent[]> {
  const ascents = await getAllAscents()
  if (filters === undefined) return ascents
  return filterAscents(ascents, filters)
}

export const optionalAscentFilterSchema = z
  .object({
    climbingDiscipline: climbingDisciplineSchema.optional(),
    crag: ascentSchema.shape.crag.optional(),
    grade: gradeSchema.optional(),
    height: ascentSchema.shape.height.optional(),
    holds: holdsSchema.optional(),
    profile: profileSchema.optional(),
    style: ascentStyleSchema.optional(),
    tries: ascentSchema.shape.tries.optional(),
    year: z.number().int().min(0).optional(),
    rating: ascentSchema.shape.rating.optional(),
  })
  .optional()

export type OptionalAscentFilter = z.infer<typeof optionalAscentFilterSchema>

export const list = orpcContract
  .route({ method: 'GET', path: '/ascents' })
  .input(optionalAscentFilterSchema)
  .output(ascentSchema.array())

export const search = orpcContract
  .route({ method: 'GET', path: '/ascents/search' })
  .input(
    z.object({
      query: z.string().min(1),
      limit: z.string().transform((val) => validNumberWithFallback(val, 10)),
    }),
  )
  .output(
    ascentSchema
      .extend({
        highlight: z.string(),
        target: z.string(),
      })
      .array(),
  )

export const findById = orpcContract
  .route({ method: 'GET', path: '/ascents/{id}' })
  .input(ascentSchema.pick({ id: true }))
  .output(ascentSchema.or(z.undefined()))

export const create = orpcContract
  .route({ method: 'POST', path: '/ascents', successStatus: 201 })
  .input(ascentSchema.omit({ id: true }))
  .output(z.boolean())

export const routerContract = {
  ascents: {
    list,
    search,
    findById,
    create,
  },
}

const orpcServer = implement(routerContract)

export const listHandler = orpcServer.ascents.list.handler(
  async ({ input }) => {
    const filteredAscents = await getFilteredAscents(input)

    return filteredAscents.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      if (dateA < dateB) return 1
      if (dateA > dateB) return -1
      return 0
    })
  },
)

export const searchHandler = orpcServer.ascents.search.handler(
  async ({ input }) => {
    const { query, limit } = input

    const results = fuzzySort.go(
      removeAccents(query),
      await getAllAscents(),
      {
        key: ({ routeName }) => routeName,
        limit,
        threshold: 0.7,
      },
    )

    return results.map((result) =>
      Object.assign(result.obj, {
        highlight: result.highlight(),
        target: result.target,
      })
    )
  },
)

export const findByIdHandler = orpcServer.ascents.findById.handler(
  async ({ input }) => {
    const ascents = await getAllAscents()
    const foundAscent = ascents.find(({ id }) => id === input.id)
    if (foundAscent === undefined) {
      return undefined
    }
    return foundAscent
  },
)

export const createHandler = orpcServer.ascents.create.handler(
  async ({ input }) => {
    try {
      await addAscent(input)
      return true
    } catch (error) {
      globalThis.console.error(error)
      return false
    }
  },
)

export const router = orpcServer.router({
  ascents: {
    list: listHandler,
    search: searchHandler,
    findById: findByIdHandler,
    create: createHandler,
  },
})
