import { assert } from 'jsr:@std/assert@^0.223.0/assert'
import { TEST_PORT } from '../benchmark/test-data.ts'
import api, { FALLBACK_PORT } from './api.ts'

Deno.env.set('ENV', 'test')
Deno.env.set('PORT', String(TEST_PORT))

const port = Number(Deno.env.get('PORT')) || FALLBACK_PORT + 1

Deno.serve({
  port,
}, (req) => api.fetch(req, { ENV: Deno.env.get('ENV') }))

console.log('TEST')

Deno.test('GET /api is ok', async () => {
  const res = await api.request('/api')
  assert(res.status === 200)
})
