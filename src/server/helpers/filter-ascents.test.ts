import { assertArrayIncludes, assertEquals } from '@std/assert'
import { sampleAscents } from 'backup/sample-ascents.ts'
import { filterAscents } from './filter-ascents.ts'

Deno.test('filterAscents', async (t) => {
  await t.step('should return all ascents when no filters are provided', () => {
    const result = filterAscents(sampleAscents)
    assertEquals(result.length, sampleAscents.length)
    assertArrayIncludes(result, sampleAscents)
  })

  await t.step(
    'should filter ascents by grade using case insensitive matching',
    () => {
      const result = filterAscents(sampleAscents, { grade: '7a' })
      assertEquals(result.length, 38)

      for (const { topoGrade } of result) {
        assertEquals(topoGrade, '7a')
      }
    },
  )

  await t.step('should filter ascents by climbingDiscipline', () => {
    const result = filterAscents(sampleAscents, { climbingDiscipline: 'Route' })
    assertEquals(result.length, 84)
    for (const { climbingDiscipline } of result) {
      assertEquals(climbingDiscipline, 'Route')
    }
  })

  await t.step('should filter ascents by year', () => {
    const result = filterAscents(sampleAscents, { year: 2022 })
    assertEquals(result.length, 13)
    for (const { date } of result) {
      assertEquals(new Date(date).getFullYear(), 2022)
    }
  })

  await t.step('should filter ascents using multiple criteria', () => {
    const result = filterAscents(sampleAscents, {
      climbingDiscipline: 'Route',
      style: 'Redpoint',
    })
    assertEquals(result.length, 27)
    for (const { climbingDiscipline, style } of result) {
      assertEquals(climbingDiscipline, 'Route')
      assertEquals(style, 'Redpoint')
    }
  })

  await t.step(
    'should return an empty array when no ascents are passed',
    () => {
      const result = filterAscents([])
      assertEquals(result.length, 0)
    },
  )
})
