import { Hono } from 'hono'

import ascentJSON from '@data/ascent-data.json' with { type: 'json' }
import { ascentSchema } from '@schema/ascent.ts'
import { groupBy } from '@utils/group-by.ts'
import { sortKeys } from '@utils/sort-keys.ts'
import { stringEqualsCaseInsensitive } from '@utils/string-equals.ts'

const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const app = new Hono()

app.get('/', (ctx) => {
  // Data : parsedAscents
  // Pipe the data through the following steps:
  // Filter : grade, tries, route-or-boulder
  // Sort : grade, tries
  // Group : grade, tries
  // Pagination : page, limit
  // Search : routeName
  // Return : result

  const grade = ctx.req.query('grade')
  const numberOfTries = ctx.req.query('tries')
  const group = ctx.req.query('group-by')
  const descending = ctx.req.query('descending')
  const routeOrBouldering = ctx.req.query('route-or-boulder')

  const filteredAscents = parsedAscents.filter(
    ({ topoGrade, routeOrBoulder, tries }) => {
      if (grade && !stringEqualsCaseInsensitive(topoGrade, grade)) {
        return false
      }
      if (
        numberOfTries && !stringEqualsCaseInsensitive(tries, numberOfTries)
      ) {
        return false
      }
      if (
        routeOrBouldering &&
        !stringEqualsCaseInsensitive(
          routeOrBoulder,
          routeOrBouldering,
        )
      ) {
        return false
      }

      return true
    },
  )

  const sortedAscents = filteredAscents.sort(
    ({ date: leftDate }, { date: rightDate }) =>
      ((new Date(leftDate)).getTime() > (new Date(rightDate)).getTime()
        ? 1
        : -1) * (descending ? -1 : 1),
  )

  const groupedAscents = group
    ? sortKeys(groupBy(sortedAscents, group))
    : sortedAscents

  return ctx.json({ data: groupedAscents })
})

export default app
