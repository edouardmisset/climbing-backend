import { Hono } from 'hono'
import { compareSimilarity } from 'text'

import {
  groupBy,
  removeAccents,
  sortBy,
  stringEqualsCaseInsensitive,
  stringIncludesCaseInsensitive,
  validNumberWithFallback,
} from '@edouardmisset/utils'

import { normalizeData } from 'helpers/normalize-data.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import { Ascent } from 'schema/ascent.ts'
import { etag } from 'hono/etag'
import { zValidator } from 'zod-validator'

import { getPreparedCachedAscents } from 'helpers/cache-ascents.ts'
import fuzzySort from 'fuzzysort'
import { boolean, string, z } from 'zod'
import { groupSimilarStrings } from 'helpers/find-similar.ts'
import { getAscents } from 'data/ascent-data.ts'

const ascents = new Hono()
ascents.use(etag())

ascents.get(
  '/',
  zValidator(
    'query',
    z.object({
      routeName: string().optional(),
      'topo-grade': string().optional(),
      year: string().optional(),
      tries: string().optional(),
      crag: string().optional(),
      'group-by': string().optional(),
      descending: boolean().optional(),
      'route-or-boulder': string().optional(),
      normalize: z.enum(['true', 'false']).optional().transform((value) =>
        value === 'true'
      ),
      sort: string().optional(),
      fields: string().optional(),
    }),
  ),
  async (ctx) => {
    /**
     * Data: validated ascents (from db or file)
     *
     * Pipe the data through the following steps:
     *
     * Filter
     * Selectors
     * Sort
     * Group
     * (Pagination)
     * Search : routeName
     *
     * Return result
     */

    const validatedQuery = ctx.req.valid('query')
    const {
      routeName: routeNameFilter,
      'topo-grade': gradeFilter,
      year: yearFilter,
      tries: numberOfTriesFilter,
      crag: cragFilter,
      'group-by': group,
      descending: dateIsDescending,
      'route-or-boulder': disciplineFilter,
      normalize = false,
      sort,
      fields,
    } = validatedQuery

    const transformFields = (
      fields: string | undefined,
    ): string[] | undefined =>
      fields === undefined ? undefined : fields.split(',').reverse()

    const sortFields = transformFields(sort)
    const selectedFields = transformFields(fields)

    const filters: {
      value?: string
      compare: (a: string, b: string) => boolean
      key: keyof Ascent
    }[] = [
      {
        value: gradeFilter,
        compare: stringEqualsCaseInsensitive,
        key: 'topoGrade',
      },
      {
        value: numberOfTriesFilter,
        compare: stringEqualsCaseInsensitive,
        key: 'tries',
      },
      {
        value: disciplineFilter,
        compare: stringEqualsCaseInsensitive,
        key: 'routeOrBoulder',
      },
      {
        value: yearFilter,
        compare: (left: string, right: string) =>
          new Date(left).getFullYear() === Number(right),
        key: 'date',
      },
      { value: cragFilter, compare: stringEqualsCaseInsensitive, key: 'crag' },
      {
        value: routeNameFilter,
        compare: stringIncludesCaseInsensitive,
        key: 'routeName',
      },
    ]

    const ascents = await getAscents()
    const filteredAscents = ascents.filter((ascent) =>
      filters.every(({ value, compare, key }) =>
        value === undefined || compare(String(ascent[key]), value)
      )
    )

    const ascentsWithSelectedFields = selectedFields === undefined
      ? filteredAscents
      : filteredAscents.map((ascent) => {
        // Separate whitelist and blacklist
        const whitelist = selectedFields.filter((field) =>
          !field.startsWith('-')
        )
        const blacklist = selectedFields.filter((field) =>
          field.startsWith('-')
        )
          .map((field) => field.slice(1))

        // If whitelist is empty, include all fields
        const finalWhitelist = whitelist.length === 0
          ? Object.keys(ascent)
          : whitelist

        // Apply whitelist and blacklist
        return Object.fromEntries(
          Object.entries(ascent).filter(([key]) =>
            finalWhitelist.includes(key) && !blacklist.includes(key)
          ),
        )
      })

    const dateSortedAscents = (ascentsWithSelectedFields as Ascent[])
      .sort(
        ({ date: leftDate }, { date: rightDate }) =>
          ((new Date(leftDate)).getTime() > (new Date(rightDate)).getTime()
            ? 1
            : -1) * (dateIsDescending ? -1 : 1),
      )
    const sortedAscents = sortFields === undefined
      ? dateSortedAscents
      : sortFields.reduce(
        (previouslySortedAscents, sortField) => {
          const ascending = sortField.startsWith('-') ? false : true
          const field = ascending ? sortField : sortField.slice(1)

          return sortBy(
            previouslySortedAscents,
            field,
            ascending,
          )
        },
        dateSortedAscents,
      )

    const sortedByClosestRouteName = routeNameFilter
      ? sortedAscents.sort((
        { routeName: aRouteName },
        { routeName: bRouteName },
      ) => compareSimilarity(routeNameFilter)(aRouteName, bRouteName))
      : sortedAscents

    const groupedAscents = group === undefined
      ? sortedByClosestRouteName
      : sortKeys(groupBy(sortedByClosestRouteName, group))

    return ctx.json({
      data: normalize
        ? normalizeData(sortedByClosestRouteName)
        : groupedAscents,
    })
  },
)
  .get('/duplicates', async (ctx) => {
    const ascentMap = new Map()
    const ascents = await getAscents()

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

    return ctx.json({ data: duplicateRoutes })
  })
  // Similar crag names
  .get('/similar', async (ctx) => {
    const ascents = await getAscents()
    const similarAscents = Array.from(
      groupSimilarStrings(
        ascents.map((ascent) => ascent.routeName),
        2,
      )
        .entries(),
    )

    return ctx.json({ data: similarAscents })
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
    async (ctx) => {
      const { query, limit } = ctx.req.valid('query')

      const results = fuzzySort.go(
        removeAccents(query),
        await getPreparedCachedAscents(),
        {
          key: (ascent) => ascent.routeName,
          limit: validNumberWithFallback(limit, 100),
          threshold: 0.5,
        },
      )

      return ctx.json({
        data: results.map((result) => ({
          highlight: result.highlight(),
          target: result.target,
          ...result.obj,
        })),
        metadata: {
          total: results.total,
        },
      })
    },
  )

export default ascents
