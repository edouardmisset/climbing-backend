import trainingJSON from './data/training-data.json' with { type: 'json' }
import ascentJSON from './data/ascent-data.json' with { type: 'json' }
import { trainingSessionSchema } from './schema/training.ts'
import { ascentSchema } from './schema/ascent.ts'
import {
  Application,
  Router,
  send,
} from 'https://deno.land/x/oak@v12.6.1/mod.ts'
import { load } from 'https://deno.land/std@0.210.0/dotenv/mod.ts'
import { groupBy } from "./utils/group-by.ts"


const env = await load()
const PORT = Number(env.PORT) || 8000

const parsedTrainingSessions = trainingSessionSchema.array().parse(trainingJSON.data)
const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

const router = new Router()
router
  .get('/favicon.ico', async (context) => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}`,
    })
  })
  .get('/', (context) => {
    context.response.redirect('/api')
  })
  .get('/api', (context) => {
    context.response.body = 'Hello API!'
  })
  .get('/api/training-sessions', (context) => {
    context.response.body = {
      data: parsedTrainingSessions,
    }
  })
  .get('/api/ascents', (context) => {
    context.response.body = { data: parsedAscents }
  })
  .get('/api/ascents-by-grades', (context) => {
    // Transformations
    const ascentsGroupedByGrade = groupBy((parsedAscents), 'topoGrade')
    const sortedAscentsGroupedByGrade = Object.fromEntries(
      Object.entries(ascentsGroupedByGrade)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    )

    context.response.body = { data: sortedAscentsGroupedByGrade }
  })
  .get('/api/ascents-by-tries', (context) => {
    // Transformations
    const ascentsGroupedByTries = groupBy((parsedAscents), 'tries')
    const sortedAscentsGroupedByTries = Object.fromEntries(
      Object.entries(ascentsGroupedByTries)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    )

    context.response.body = { data: sortedAscentsGroupedByTries }
  })


const app = new Application()

// Logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.headers.get('X-Response-Time')
  globalThis.console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`)
})

// Timer
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.response.headers.set('X-Response-Time', `${ms}ms`)
})
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: PORT })
