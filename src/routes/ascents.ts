import { Hono } from 'hono'

import ascentJSON from '@data/ascent-data.json' with { type: 'json' }
import { Ascent, ascentSchema } from '@schema/ascent.ts'
import { groupBy } from '@utils/group-by.ts'
import { sortBy } from '@utils/sort-by.ts'
import { sortKeys } from '@utils/sort-keys.ts'
import { stringEqualsCaseInsensitive } from '@utils/string-equals.ts'
import { stringIncludesCaseInsensitive } from '@utils/string-includes.ts'

const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const app = new Hono()

app.get('/', (ctx) => {
  // Data : validated ascents (from db or file)
  // Pipe the data through the following steps:
  // Filter : grade, tries, route-or-boulder
  // Selectors: whitelist, blacklist
  // Sort : grade, tries
  // Group : grade, tries, year...
  // Pagination : page, limit
  // Search : routeName
  // Return : result

  const {
    routeName: routeNameFilter,
    topoGrade: gradeFilter,
    year: yearFilter,
    tries: numberOfTriesFilter,
    crag: cragFilter,
    'group-by': group,
    descending: dateIsDescending,
    'route-or-boulder': disciplineFilter,
  } = ctx.req.query()
  const sortFields = ctx.req.queries('sort')?.flatMap((list) => list.split(','))
  const selectedFields = ctx.req.queries('fields')?.flatMap((list) =>
    list.split(',')
  )

  const filters: {
    value: string
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

  const filteredAscents = parsedAscents.filter((ascent) =>
    filters.every(({ value, compare, key }) =>
      value === undefined || compare(ascent[key] as string, value)
    )
  )

  const ascentsWithSelectedFields = selectedFields === undefined
    ? filteredAscents
    : filteredAscents.map((ascent) => {
      // Separate whitelist and blacklist
      const whitelist = selectedFields.filter((field) => !field.startsWith('-'))
      const blacklist = selectedFields.filter((field) => field.startsWith('-'))
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
        return sortBy(
          previouslySortedAscents,
          sortField,
          ascending,
        )
      },
      dateSortedAscents,
    )

  const groupedAscents = group !== undefined
    ? sortKeys(groupBy(sortedAscents, group))
    : sortedAscents

  return ctx.json({ data: groupedAscents })
})

export default app
