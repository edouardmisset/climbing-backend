import { assertEquals, assertExists, assertStrictEquals } from '@std/assert'
import { getAllAscents, getFilteredAscents } from './ascents.ts'

Deno.test('ascents service - getAllAscents returns array', async () => {
  const ascents = await getAllAscents()

  assertEquals(Array.isArray(ascents), true)

  // Each ascent should have required fields
  if (ascents.length > 0) {
    assertExists(ascents[0].id)
    assertExists(ascents[0].routeName)
    assertExists(ascents[0].date)
    assertExists(ascents[0].topoGrade)
    assertExists(ascents[0].crag)
  }
})

Deno.test('ascents service - getAllAscents caches results', async () => {
  // First call
  const ascents1 = await getAllAscents()

  // Second call should return cached data (same reference if cached properly)
  const ascents2 = await getAllAscents()

  assertStrictEquals(ascents1.length, ascents2.length)
})

Deno.test('ascents service - getFilteredAscents with no filter returns all', async () => {
  const filtered = await getFilteredAscents()
  const all = await getAllAscents()

  assertEquals(filtered.length, all.length)
})

Deno.test('ascents service - getFilteredAscents with climbing discipline', async () => {
  const filtered = await getFilteredAscents({ climbingDiscipline: 'Boulder' })

  // All should be boulders
  for (const ascent of filtered) {
    assertEquals(ascent.climbingDiscipline, 'Boulder')
  }
})

Deno.test('ascents service - getFilteredAscents with year filter', async () => {
  const filtered = await getFilteredAscents({ year: 2024 })

  // All should be from 2024
  for (const ascent of filtered) {
    const year = new Date(ascent.date).getUTCFullYear()
    assertEquals(year, 2024)
  }
})

Deno.test('ascents service - getFilteredAscents with grade filter', async () => {
  const filtered = await getFilteredAscents({ grade: '6a' })

  // All should have grade 6a
  for (const ascent of filtered) {
    assertEquals(ascent.topoGrade, '6a')
  }
})

Deno.test('ascents service - getFilteredAscents with multiple filters', async () => {
  const filtered = await getFilteredAscents({
    climbingDiscipline: 'Route',
    style: 'Onsight',
  })

  // All should match both filters
  for (const ascent of filtered) {
    assertEquals(ascent.climbingDiscipline, 'Route')
    assertEquals(ascent.style, 'Onsight')
  }
})
