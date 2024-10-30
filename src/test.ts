import { assert } from 'jsr:@std/assert@^0.223.0/assert'
import { assertArrayIncludes } from 'jsr:@std/assert@^0.223.0/assert-array-includes'

import sampleAscents from 'backup/ascent-data-sample-2024-10-30T15:53:27.118Z.json' with {
  type: 'json',
}
import { createAscentRoute } from 'routes/ascents.ts'
import type { Ascent } from 'schema/ascent.ts'
import { app } from './app.ts'

Deno.test('GET /api is ok', async () => {
  const res = await app.request('/api')
  assert(res.status === 200)
})

Deno.test('GET /ascents', async () => {
  const mockFetchAscents = async () => await sampleAscents as Ascent[]

  const app = createAscentRoute(mockFetchAscents)
  const res = await app.request('/')
  assert(res.status === 200)

  const json = await res.json() as { data: unknown[] }

  assertArrayIncludes(sampleAscents, json.data)
})
