import { Hono } from 'hono'

import ascentJSON from '@data/ascent-data.json' with { type: 'json' }
import { ascentSchema } from '@schema/ascent.ts'
import { groupBy } from '@utils/group-by.ts'
import { sortKeys } from '@utils/sort-keys.ts'
import { stringEqualsCaseInsensitive } from '@utils/string-equals.ts'
import { sortBy } from '@utils/sort-by.ts'

const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const app = new Hono()

app.get('/', (ctx) => {
  // Data : validated ascents (from db or file)
  // Pipe the data through the following steps:
  // Filter : grade, tries, route-or-boulder
  // Sort : grade, tries
  // Group : grade, tries, year...
  // Pagination : page, limit
  //? Search : routeName
  // Return : result

  const gradeFilter = ctx.req.query('topoGrade')
  const yearFilter = Number(ctx.req.query('year'))
  const numberOfTriesFilter = ctx.req.query('tries')
  const cragFilter = ctx.req.query('crag')
  const group = ctx.req.query('group-by')
  const dateIsDescending = ctx.req.query('descending') === 'true'
  const disciplineFilter = ctx.req.query('route-or-boulder')
  const sortFields = ctx.req.queries('sort')?.flatMap((s) => s.split(','))

  const filteredAscents = parsedAscents.filter(
    ({ topoGrade, routeOrBoulder, tries, date, crag }) => {
      if (
        gradeFilter !== undefined &&
        !stringEqualsCaseInsensitive(topoGrade, gradeFilter)
      ) {
        return false
      }
      if (
        numberOfTriesFilter !== undefined &&
        !stringEqualsCaseInsensitive(tries, numberOfTriesFilter)
      ) {
        return false
      }
      if (
        disciplineFilter !== undefined &&
        !stringEqualsCaseInsensitive(
          routeOrBoulder,
          disciplineFilter,
        )
      ) {
        return false
      }
      if (
        yearFilter !== undefined &&
        new Date(date).getFullYear() !== yearFilter
      ) {
        return false
      }
      if (
        cragFilter !== undefined &&
        cragFilter !== crag
      ) {
        return false
      }

      return true
    },
  )

  const dateSortedAscents = filteredAscents
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
