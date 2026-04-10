import { assertEquals, assertExists } from '@std/assert'
import app from '~/app.ts'

const fetchAndAssertList = async (path: string): Promise<unknown[]> => {
  const req = new Request(`http://localhost${path}`)
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as unknown[]

  assertEquals(Array.isArray(body), true)

  return body
}

Deno.test('ORPC - GET /openapi/training returns training list', async () => {
  const body = await fetchAndAssertList('/openapi/training')

  // All items should have required fields
  if (body.length <= 0) return

  const firstSession = body[0] as Record<string, unknown>
  assertExists(firstSession.id)
  assertExists(firstSession.date)
})

for (const endpoint of [
  { path: '/openapi/areas', name: 'areas' },
  { path: '/openapi/crags', name: 'crags' },
  { path: '/openapi/grades', name: 'grades' },
]) {
  Deno.test(`ORPC - GET ${endpoint.path} returns ${endpoint.name} list`, async () => {
    await fetchAndAssertList(endpoint.path)
  })
}

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
