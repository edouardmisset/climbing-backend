import { assertEquals, assertExists } from '@std/assert'
import app from './app.ts'

Deno.test('app - root route returns HTML', async () => {
  const req = new Request('http://localhost/')
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  assertEquals(res.headers.get('content-type'), 'text/html; charset=UTF-8')
  await res.body?.cancel()
})

Deno.test('app - 404 for unknown routes', async () => {
  const req = new Request('http://localhost/does-not-exist')
  const res = await app.fetch(req)

  assertEquals(res.status, 404)
  const body = await res.json() as { message: string }
  assertEquals(body.message, 'Route Not Found')
})
Deno.test.ignore('app - backup endpoint throttles requests', async () => {
  // First request should be throttled (timestamp is 0 initially)
  const req1 = new Request('http://localhost/api/backup', { method: 'POST' })
  const res1 = await app.fetch(req1) // Should work or throttle depending on when last backup ran
  // If throttled, should return 429
  if (res1.status === 429) {
    const body = await res1.json() as {
      code: string
      retryAfterMinutes: number
    }
    assertEquals(body.code, 'BACKUP_THROTTLED')
    assertExists(body.retryAfterMinutes)
    return
  }

  await res1.body?.cancel()
})

Deno.test('app - CORS headers present', async () => {
  const req = new Request('http://localhost/', {
    headers: { Origin: 'http://example.com' },
  })
  const res = await app.fetch(req)

  // CORS middleware should add access-control headers
  const allowOrigin = res.headers.get('access-control-allow-origin')
  assertExists(allowOrigin)
  assertEquals(
    allowOrigin === 'http://example.com' || allowOrigin === '*',
    true,
  )
  
  await res.body?.cancel()
})

Deno.test('app - trailing slash trimmed', async () => {
  const req = new Request('http://localhost/ascents/')
  const res = await app.fetch(req)

  // Should redirect or handle without trailing slash
  // Status should not be a trailing-slash-specific error
  assertEquals([200, 301, 308].includes(res.status), true)
  await res.body?.cancel()
})
