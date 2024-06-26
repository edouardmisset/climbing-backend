import { load } from '@std/dotenv'
import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'
import { etag } from 'hono/etag'
import { timing } from 'hono/timing'
import { csrf } from 'hono/csrf'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import areas from '@routes/areas.ts'
import ascents from '@routes/ascents.ts'
import crags from '@routes/crags.ts'
import training from '@routes/training.ts'

import { syncAscentsAndTrainingFromGoogleSheets } from './scripts/import-training-and-ascent-data-from-gs.ts'

const { ENV } = await load()
export const FALLBACK_PORT = 8000

const api = new Hono().basePath('/api')

ENV === 'production' && api.use(etag({ weak: true }))
ENV === 'dev' && api.use(timing())
api.use(cors())
ENV === 'production' && api.use(csrf())
ENV === 'production' && api.use(compress())
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

api.post('/sync', async (ctx) => {
  try {
    const _5Minutes = 1000 * 60 * 5
    if (Date.now() - timestamp < _5Minutes) {
      ctx.status(200)
      return ctx.json({
        status: 'failure',
        message: `Sync was triggered less than ${_5Minutes} min ago.`,
      })
    }
    const success = await syncAscentsAndTrainingFromGoogleSheets()
    timestamp = Date.now()
    ctx.status(200)
    return ctx.json({ status: success ? 'success' : 'failure' })
  } catch (error) {
    console.error(error)
    ctx.status(500)
    return ctx.json(error)
  }
})

api.route('/areas', areas)
api.route('/ascents', ascents)
api.route('/crags', crags)
api.route('/training', training)

export default api
