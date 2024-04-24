import api, { FALLBACK_PORT } from './server.ts'

Deno.env.set('ENV', 'production')
Deno.env.set('PORT', '8000')

Deno.serve({
  port: Number(Deno.env.get('PORT')) || FALLBACK_PORT,
}, (req) => api.fetch(req, { ENV: Deno.env.get('ENV') }))
