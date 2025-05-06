import { assertArrayIncludes, assertEquals } from '@std/assert'
import { sampleAscents } from 'backup/samples.ts'
import { filterAscents } from './filter-ascents.ts'
import type { Ascent } from 'schema/ascent.ts'

Deno.test('filterAscents', async (t) => {
  await t.step('should return all ascents when no filters are provided', () => {
    const result = filterAscents(sampleAscents)
    assertEquals(result.length, sampleAscents.length)
    assertArrayIncludes(result, sampleAscents)
  })

  await t.step(
    'should filter ascents by grade using case insensitive matching',
    () => {
      const discriminator: Ascent['topoGrade'] = '7a'
      const result = filterAscents(sampleAscents, { grade: discriminator })
      const expected = sampleAscents.filter(
        (ascent) =>
          ascent.topoGrade.toLowerCase() === discriminator.toLowerCase(),
      )
      assertEquals(result.length, expected.length)

      for (const { topoGrade } of result) {
        assertEquals(topoGrade.toLowerCase(), discriminator.toLowerCase())
      }
    },
  )

  await t.step('should filter ascents by climbingDiscipline', () => {
    const discriminator: Ascent['climbingDiscipline'] = 'Boulder'
    const result = filterAscents(sampleAscents, {
      climbingDiscipline: discriminator,
    })

    const expected = sampleAscents.filter(
      (ascent) => ascent.climbingDiscipline === discriminator,
    )
    assertEquals(result.length, expected.length)
    for (const { climbingDiscipline } of result) {
      assertEquals(climbingDiscipline, discriminator)
    }
  })

  await t.step('should filter ascents by year', () => {
    const discriminator = 2022
    const result = filterAscents(sampleAscents, { year: discriminator })
    const expected = sampleAscents.filter(
      (ascent) => new Date(ascent.date).getFullYear() === discriminator,
    )
    assertEquals(result.length, expected.length)

    for (const { date } of result) {
      assertEquals(new Date(date).getFullYear(), discriminator)
    }
  })

  await t.step('should filter ascents using multiple criteria', () => {
    const discriminator = {
      climbingDiscipline: 'Route',
      style: 'Redpoint',
    } as const satisfies Pick<Ascent, 'climbingDiscipline' | 'style'>

    const result = filterAscents(sampleAscents, discriminator)
    const expected = sampleAscents.filter(
      (ascent) =>
        ascent.climbingDiscipline === discriminator.climbingDiscipline &&
        ascent.style === discriminator.style,
    )
    assertEquals(result.length, expected.length)

    for (const { climbingDiscipline, style } of result) {
      assertEquals(climbingDiscipline, discriminator.climbingDiscipline)
      assertEquals(style, discriminator.style)
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
