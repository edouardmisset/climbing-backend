import { assert, assertArrayIncludes } from '@std/assert'
import sampleAscents from 'backup/ascent-data-sample-2024-10-30.json' with {
  type: 'json',
}
import { testClient } from 'hono/testing'
import { createAscentRoute } from 'routes/ascents.ts'
import type { Ascent } from 'schema/ascent.ts'
import app from './app.ts'
import { shutdownOpenTelemetry } from 'helpers/open-telemetry.ts'

Deno.test('GET /api is ok', async () => {
  const res = await testClient(app).api.$get()
  assert(res.status === 200)

  await shutdownOpenTelemetry()
})

Deno.test('GET /ascents', async () => {
  const mockFetchAscents = async () => await sampleAscents as Ascent[]

  const ascentsApp = createAscentRoute(mockFetchAscents)
  const res = await testClient(ascentsApp).index.$get()
  assert(res.status === 200)

  const { data } = await res.json() as { data: unknown[] }

  assertArrayIncludes(sampleAscents, data)
})
