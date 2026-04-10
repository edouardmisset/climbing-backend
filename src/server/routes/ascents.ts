import { removeAccents } from '@edouardmisset/text'
import fuzzySort from 'fuzzysort'
import {
  addAscent,
  getAllAscents,
  getFilteredAscents,
} from 'services/ascents.ts'
import { orpcServer } from './server.ts'
import { FUZZY_SEARCH_THRESHOLD } from '../constants.ts'

export const list = orpcServer.ascents.list.handler(
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

export const search = orpcServer.ascents.search.handler(
  async ({ input }) => {
    const { query, limit } = input

    const results = fuzzySort.go(
      removeAccents(query),
      await getAllAscents(),
      {
        key: ({ routeName }) => removeAccents(routeName),
        limit,
        threshold: FUZZY_SEARCH_THRESHOLD,
      },
    )

    // Return a new object per result to avoid mutating cached ascent objects
    return results.map((result) => ({
      ...result.obj,
      highlight: result.highlight(),
      target: result.target,
    }))
  },
)

export const findById = orpcServer.ascents.findById.handler(
  async ({ input }) => {
    const ascents = await getAllAscents()
    const foundAscent = ascents.find(({ id }) => id === input.id)
    if (foundAscent === undefined) {
      return undefined
    }
    return foundAscent
  },
)

export const create = orpcServer.ascents.create.handler(
  async ({ input }) => {
    try {
      return await addAscent(input)
    } catch (error) {
      throw new Error("Failed to add ascent", { cause: error })
    }
  },
)
