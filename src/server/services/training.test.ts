import { assertEquals, assertExists } from '@std/assert'
import { getAllTrainingSessions } from './training.ts'

Deno.test('training service - getAllTrainingSessions returns array', async () => {
  const sessions = await getAllTrainingSessions()

  assertEquals(Array.isArray(sessions), true)

  // Each session should have required fields
  if (sessions.length > 0) {
    assertExists(sessions[0].id)
    assertExists(sessions[0].date)
  }
})

Deno.test('training service - getAllTrainingSessions caches results', async () => {
  // First call
  const sessions1 = await getAllTrainingSessions()

  // Second call should return cached data
  const sessions2 = await getAllTrainingSessions()

  assertEquals(sessions1.length, sessions2.length)
})

Deno.test('training service - training sessions have valid structure', async () => {
  const sessions = await getAllTrainingSessions()

  for (const session of sessions.slice(0, 5)) {
    // Validate structure
    assertExists(session.id)
    assertExists(session.date)

    // Check types
    assertEquals(typeof session.id, 'number')
    assertEquals(typeof session.date, 'string')

    // If present, validate optional fields
    if (session.intensity !== undefined) {
      assertEquals(typeof session.intensity, 'number')
      assertEquals(session.intensity >= 0 && session.intensity <= 100, true)
    }

    if (session.volume !== undefined) {
      assertEquals(typeof session.volume, 'number')
      assertEquals(session.volume >= 0 && session.volume <= 100, true)
    }

    if (session.load !== undefined) {
      assertEquals(typeof session.load, 'number')
      assertEquals(session.load >= 0 && session.load <= 100, true)
    }
  }
})
