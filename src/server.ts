import { load } from '@std/dotenv'
import { Hono } from 'hono'
import {
  compress,
  cors,
  csrf,
  etag,
  logger,
  serveStatic,
  timing,
} from 'hono/middleware'

import ascents from '@routes/ascents.ts'
import training from '@routes/training.ts'

const { ENV } = await load()
export const FALLBACK_PORT = 8000

const api = new Hono().basePath('/api')

ENV === 'production' && api.use(etag())
ENV === 'dev' && api.use(timing())
ENV === 'production' && api.use(cors())
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

api.route('/ascents', ascents)
api.route('/training', training)

export default api
