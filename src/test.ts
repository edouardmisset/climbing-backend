import { assert, assertArrayIncludes } from '@std/assert'
import { sampleAscents } from 'backup/sample-ascents.ts'
import { shutdownOpenTelemetry } from 'helpers/open-telemetry.ts'
import { testClient } from 'hono/testing'
import { createAscentRoute } from 'routes/ascents.ts'
import app from './app.ts'

Deno.test('GET /api is ok', async () => {
  const res = await testClient(app).api.$get()
  assert(res.status === 200)

  await shutdownOpenTelemetry()
})

Deno.test('GET /ascents', async () => {
  const mockFetchAscents = async () => await sampleAscents

  const ascentsApp = createAscentRoute(mockFetchAscents)
  const res = await testClient(ascentsApp).index.$get()
  assert(res.status === 200)

  const { data } = await res.json() as { data: unknown[] }

  assertArrayIncludes(sampleAscents, data)
})
