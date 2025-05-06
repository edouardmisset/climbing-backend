import { assert, assertArrayIncludes } from '@std/assert'
import { sampleAscents, sampleTrainingSessions } from 'backup/samples.ts'
import { shutdownOpenTelemetry } from 'helpers/open-telemetry.ts'
import { testClient } from 'hono/testing'
import { createAscentRoute } from 'routes/ascents.ts'
import { createTrainingRoute } from 'routes/training.ts'
import { ascentSchema } from 'schema/ascent.ts'
import app from './app.ts'
import { trainingSessionSchema } from 'schema/training.ts'

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

  assert(ascentSchema.array().parse(data))

  assertArrayIncludes(sampleAscents, data)
})

Deno.test('GET /training', async () => {
  const mockFetchTraining = async () => await sampleTrainingSessions

  const trainingApp = createTrainingRoute(mockFetchTraining)

  const res = await testClient(trainingApp).index.$get()
  assert(res.status === 200)

  const { data } = await res.json() as { data: unknown[] }

  assert(trainingSessionSchema.array().parse(data))

  assertArrayIncludes(sampleTrainingSessions, data)
})
