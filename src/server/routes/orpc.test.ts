import { assertEquals, assertExists } from '@std/assert'
import app from '~/app.ts'

Deno.test('ORPC - GET /openapi/training returns training list', async () => {
  const req = new Request('http://localhost/openapi/training')
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as unknown[]

  // Should return an array
  assertEquals(Array.isArray(body), true)

  // All items should have required fields
  if (body.length > 0) {
    const firstSession = body[0] as Record<string, unknown>
    assertExists(firstSession.id)
    assertExists(firstSession.date)
  }
})

Deno.test('ORPC - GET /openapi/areas returns area list', async () => {
  const req = new Request('http://localhost/openapi/areas')
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as unknown[]

  assertEquals(Array.isArray(body), true)
})

Deno.test('ORPC - GET /openapi/crags returns crag list', async () => {
  const req = new Request('http://localhost/openapi/crags')
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as unknown[]

  assertEquals(Array.isArray(body), true)
})

Deno.test('ORPC - GET /openapi/grades returns grade list', async () => {
  const req = new Request('http://localhost/openapi/grades')
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as unknown[]

  assertEquals(Array.isArray(body), true)
})

Deno.test('ORPC - OPTIONS request includes CORS headers', async () => {
  const req = new Request('http://localhost/openapi/ascents', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://example.com',
      'Access-Control-Request-Method': 'GET',
    },
  })
  const res = await app.fetch(req)

  // CORS should be handled
  assertExists(res.headers.get('access-control-allow-origin'))
})

Deno.test('ORPC - invalid route returns 404', async () => {
  const req = new Request('http://localhost/openapi/invalid')
  const res = await app.fetch(req)

  assertEquals(res.status, 404)
})
