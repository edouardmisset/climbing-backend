import { showRoutes } from 'hono/dev'
import { app, FALLBACK_PORT } from './app.ts'

Deno.serve({
  port: Number(Deno.env.get('PORT')) || FALLBACK_PORT,
}, app.fetch)

if (Deno.env.get('ENV') === 'dev') showRoutes(app)
