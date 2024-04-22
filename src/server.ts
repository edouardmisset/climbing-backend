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

const env = await load()
const PORT = Number(env.PORT) || 8000

const api = new Hono().basePath('/api')

api.use(timing())
api.use(etag())
api.use(cors())
api.use(csrf())
api.use(compress())
api.use(logger())
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

Deno.serve({ port: PORT }, api.fetch)

export default api
