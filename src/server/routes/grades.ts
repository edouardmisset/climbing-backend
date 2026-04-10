import { frequency as calcFrequency } from '@edouardmisset/array'
import { average as calcAverage } from '@edouardmisset/math/average.ts'
import {
  convertGradeToNumber,
  convertNumberToGrade,
} from 'helpers/converters.ts'
import { sortKeys } from 'helpers/sort-keys.ts'
import { type Grade } from 'schema/ascent.ts'
import { getFilteredAscents } from 'services/ascents.ts'
import { orpcServer } from './server.ts'

export const list = orpcServer.grades.list.handler(
  async ({ input }) => {
    const filteredGrades = (await getFilteredAscents(input))
      .map(({ topoGrade }) => topoGrade)

    return [...new Set(filteredGrades)].sort()
  },
)

export const frequency = orpcServer.grades.frequency.handler(
  async ({ input }) => {
    const filteredGrades = (await getFilteredAscents(input))
      .map(({ topoGrade }) => topoGrade)

    return sortKeys(
      calcFrequency(filteredGrades),
      true,
    )
  },
)

export const average = orpcServer.grades.average.handler(
  async ({ input }) => {
    const filteredNumberGrades = (await getFilteredAscents(input))
      .map(({ topoGrade }) => convertGradeToNumber(topoGrade as Grade))

    if (filteredNumberGrades.length === 0) return '1a'

    return convertNumberToGrade(
      Math.round(calcAverage(filteredNumberGrades)),
    )
  },
)
