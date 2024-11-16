import { testClient } from 'hono/testing'

import { assert, assertArrayIncludes } from '@std/assert'

import sampleAscents from './server/backup/ascent-data-sample-2024-10-30.json' with {
  type: 'json',
}
import { createAscentRoute } from 'routes/ascents.ts'
import type { Ascent } from 'schema/ascent.ts'
import { app } from './app.ts'

Deno.test('GET /api is ok', async () => {
  const res = await testClient(app).api.$get()
  assert(res.status === 200)
})

Deno.test('GET /ascents', async () => {
  const mockFetchAscents = async () => await sampleAscents as Ascent[]

  const app = createAscentRoute(mockFetchAscents)
  const res = await testClient(app).index.$get({ query: {} })
  assert(res.status === 200)

  const json = await res.json() as { data: unknown[] }

  assertArrayIncludes(sampleAscents, json.data)
})
