import api, { FALLBACK_PORT } from './api.ts'
import { showRoutes } from 'hono/dev'

Deno.env.set('ENV', 'dev')
Deno.env.set('PORT', '8000')

Deno.serve({
  port: Number(Deno.env.get('PORT')) || FALLBACK_PORT,
}, (req) => api.fetch(req, { ENV: Deno.env.get('ENV') }))

showRoutes(api)
