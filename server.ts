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

import ascents from './src/routes/ascents.ts'
import training from './src/routes/training.ts'

const env = await load()
const PORT = Number(env.PORT) || 8000

const api = new Hono().basePath('/api')

api.use(timing())
api.use(etag())
api.use(cors())
api.use(csrf())
api.use(prettyJSON({
  space: 2,
}))
api.use(compress())
api.use(logger())
api.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))

api.route('/ascents', ascents)
api.route('/training', training)

api
  .get('/', (ctx) =>
    ctx.html(
      `<h1>Hello API!</h1></br>
      <a href="api/ascents" >Ascents</a></br>
      <a href="api/training" >Training</a>`,
    ))

Deno.serve({ port: PORT }, api.fetch)
