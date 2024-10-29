import { assert } from 'jsr:@std/assert@^0.223.0/assert'
import app from './app.ts'

Deno.test('GET /api is ok', async () => {
  const res = await app.request('/api')
  assert(res.status === 200)
})
