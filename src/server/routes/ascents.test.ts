import { assert, assertEquals, assertExists } from '@std/assert'
import app from '~/app.ts'

Deno.test('ORPC - GET /openapi/ascents returns ascent list', async () => {
  const req = new Request('http://localhost/openapi/ascents')
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as unknown[]

  // Should return an array
  assertEquals(Array.isArray(body), true)

  // All items should have required fields
  if (body.length > 0) {
    const firstAscent = body[0] as Record<string, unknown>
    assertExists(firstAscent.id)
    assertExists(firstAscent.routeName)
    assertExists(firstAscent.date)
  }
})

Deno.test('ORPC - GET /openapi/ascents with filters', async () => {
  const url = new URL('http://localhost/openapi/ascents')
  url.searchParams.set('climbingDiscipline', 'Boulder')

  const req = new Request(url)
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as Array<{ climbingDiscipline?: string }>

  // All results should match the filter
  assertEquals(Array.isArray(body), true)
  for (const ascent of body) {
    if (ascent.climbingDiscipline) {
      assertEquals(ascent.climbingDiscipline, 'Boulder')
    }
  }
})

Deno.test('ORPC - GET /openapi/ascents/search with query', async () => {
  const url = new URL('http://localhost/openapi/ascents/search')
  url.searchParams.set('query', 'a')
  url.searchParams.set('limit', '5')

  const req = new Request(url)
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as Array<{
    highlight: string
    target: string
    routeName: string
  }>

  assertEquals(Array.isArray(body), true)

  // Results should have highlight and target fields
  for (const item of body) {
    assertExists(item.highlight)
    assertExists(item.target)
    assertExists(item.routeName)
  }
})

Deno.test('ORPC - GET /openapi/ascents/{id} returns specific ascent', async () => {
  const req = new Request('http://localhost/openapi/ascents/0')
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const body = await res.json() as { id: number; routeName: string } | null

  // Should return either an ascent or null
  if (body !== null) {
    assertEquals(body.id, 0)
    assertExists(body.routeName)
  }
})

Deno.test('ORPC - GET /openapi/ascents/{id} with non-existent id', async () => {
  const req = new Request('http://localhost/openapi/ascents/999999')
  const res = await app.fetch(req)

  assertEquals(res.status, 200)
  const text = await res.text()

  // ORPC returns empty body for undefined/null, so check for empty or "null" string
  assert(
    text === '' || text === 'null',
    `Expected empty or null response, got: ${text}`,
  )
})
