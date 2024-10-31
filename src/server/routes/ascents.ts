import { Hono } from 'hono'
import { compareSimilarity } from '@std/text'

import {
  groupBy,
  removeAccents,
  sortBy,
  stringEqualsCaseInsensitive,
  stringIncludesCaseInsensitive,
  validNumberWithFallback,
} from '@edouardmisset/utils'

import { sortKeys } from 'helpers/sort-keys.ts'
import { zValidator } from 'zod-validator'
import { Ascent, ascentSchema } from 'schema/ascent.ts'

import fuzzySort from 'fuzzysort'
import { groupSimilarStrings } from 'helpers/find-similar.ts'
import { string, z } from 'zod'
import { getAllAscents } from 'services/ascents.ts'

// deno-lint-ignore explicit-module-boundary-types
export const createAscentRoute = (fetchAscents = getAllAscents) =>
  new Hono().get(
    '/',
    zValidator(
      'query',
      z.object({
        routeName: string().optional(),
        'topo-grade': string().optional(),
        year: string().optional(),
        tries: string().optional(),
        crag: string().optional(),
        'group-by': ascentSchema.keyof().optional(),
        descending: string().transform((s) => s === 'true').optional(),
        climbingDiscipline: string().optional(),
        sort: string().optional(),
        fields: string().optional(),
      }),
    ),
    async (c) => {
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

      const validatedQuery = c.req.valid('query')
      const {
        routeName: routeNameFilter,
        'topo-grade': gradeFilter,
        year: yearFilter,
        tries: numberOfTriesFilter,
        crag: cragFilter,
        'group-by': group,
        descending: dateIsDescending,
        climbingDiscipline: disciplineFilter,
        sort,
        fields,
      } = validatedQuery

      const transformFields = (
        fields: string | undefined,
      ): (keyof Ascent)[] | undefined =>
        fields === undefined
          ? undefined
          : fields.split(',').reverse() as (keyof Ascent)[]

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
          key: 'climbingDiscipline',
        },
        {
          value: yearFilter,
          compare: (left: string, right: string) => {
            if (right === '') return true
            return new Date(left).getFullYear() === Number(right)
          },
          key: 'date',
        },
        {
          value: cragFilter,
          compare: stringEqualsCaseInsensitive,
          key: 'crag',
        },
        {
          value: routeNameFilter,
          compare: stringIncludesCaseInsensitive,
          key: 'routeName',
        },
      ]

      const ascents = await fetchAscents()
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
            const field = ascending
              ? sortField
              : sortField.slice(1) as keyof Ascent

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

      return c.json({
        data: groupedAscents,
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
