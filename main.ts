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

const env = await load()
const PORT = Number(env.PORT) || 8000

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
    const payload = {
      data: trainingSessionSchema.array().parse(trainingJSON.data),
    }

    context.response.body = payload
  })
  .get('/api/ascents', (context) => {
    const payload = {
      data: ascentSchema.array().parse(ascentJSON.data),
    }

    context.response.body = payload
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
