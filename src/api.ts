import { load } from '@std/dotenv'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { serveStatic } from 'hono/deno'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { endTime, startTime, timing } from 'hono/timing'
import { trimTrailingSlash } from 'hono/trailing-slash'

import areas from 'routes/areas.ts'
import ascents from 'routes/ascents.ts'
import crags from 'routes/crags.ts'
import training from 'routes/training.ts'

import { syncAscentsAndTrainingFromGoogleSheets } from './scripts/import-training-and-ascent-data-from-gs.ts'

const { ENV } = await load()
export const FALLBACK_PORT = 8000

const api = new Hono().basePath('/api')

ENV === 'production' && api.use(etag({ weak: true }))
ENV === 'dev' && api.use(timing())
api.use(cors()).use(trimTrailingSlash())
ENV === 'production' && api.use(csrf()).use(compress())
ENV === 'dev' && api.use(logger())
api.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))

api
  .get('/', (ctx) =>
    ctx.html(
      `<h1>Hello API!</h1></br>
      <a href="api/ascents" >Ascents</a></br>
      <a href="api/training" >Training</a>`,
    ))

let timestamp = 0
api.all('/sync', async (ctx) => {
  try {
    const throttleTimeInMinutes = 5
    const throttleTimeInMs = 1000 * 60 * throttleTimeInMinutes
    if (Date.now() - timestamp < throttleTimeInMs) {
      ctx.status(200)
      return ctx.json({
        status: 'failure',
        message:
          `Sync was triggered less than ${throttleTimeInMinutes} min ago.`,
      })
    }
    startTime(ctx, 'sync', 'Synchronisation with Google Sheets')
    const success = await syncAscentsAndTrainingFromGoogleSheets()
    endTime(ctx, 'sync')
    timestamp = Date.now()
    return ctx.json({ status: success ? 'success' : 'failure' }, 200)
  } catch (error) {
    console.error(error)
    return ctx.json(JSON.stringify(error), 500)
  }
})

api.route('/areas', areas)
  .route('/ascents', ascents)
  .route('/crags', crags)
  .route('/training', training)

api.notFound((ctx) => ctx.json({ message: 'Not Found' }, 404))

export default api
