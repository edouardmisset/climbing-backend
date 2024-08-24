import api, { FALLBACK_PORT } from './api.ts'

Deno.env.set('ENV', 'test')
Deno.env.set('PORT', '8001')

Deno.serve({
  port: Number(Deno.env.get('PORT')) || FALLBACK_PORT + 1,
}, (req) => api.fetch(req, { ENV: Deno.env.get('ENV') }))
