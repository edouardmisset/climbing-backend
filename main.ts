import { load } from 'dotenv'
import { Hono } from 'hono'
import {
  compress,
  cors,
  csrf,
  etag,
  logger,
  prettyJSON,
  serveStatic,
  timing,
} from 'hono/middleware'

import ascentJSON from './data/ascent-data.json' with { type: 'json' }
import trainingJSON from './data/training-data.json' with { type: 'json' }
import { ascentSchema } from './schema/ascent.ts'
import { trainingSessionSchema } from './schema/training.ts'
import { groupBy } from './utils/group-by.ts'
import { sortKeys } from './utils/sort-keys.ts'
import { stringEqualsCaseInsensitive } from './utils/string-equals.ts'

const parsedTrainingSessions = trainingSessionSchema.array().parse(
  trainingJSON.data,
)
const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const env = await load()
const PORT = Number(env.PORT) || 8000

const app = new Hono()

app.use(timing())
app.use(etag())
app.use('/api/*', cors())
app.use(csrf())
app.use(prettyJSON({
  space: 2
}))
app.use(compress())
app.use(logger())
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))

app
  .get('/', (ctx) => ctx.redirect('/api'))
  .get('/api', (ctx) => ctx.text('Hello API!'))
  .get('/api/training-sessions', (ctx) =>
    ctx.json({
      data: parsedTrainingSessions,
    }))
  .get('/api/ascents', (ctx) => {
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

Deno.serve({ port: PORT }, app.fetch)
