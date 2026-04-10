import { frequency as calcFrequency } from '@edouardmisset/array'
import { mapObject, objectKeys } from '@edouardmisset/object'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import {
  convertGradeToNumber,
  ROUTE_GRADE_TO_NUMBER,
} from 'helpers/converters.ts'
import { findSimilar, groupSimilarStrings } from 'helpers/find-similar.ts'
import { sortNumericalValues } from 'helpers/sort-values.ts'
import { type Ascent, Grade } from 'schema/ascent.ts'
import { getAllAscents } from 'services/ascents.ts'
import { orpcServer } from './server.ts'

const highestGradeNumber = [...ROUTE_GRADE_TO_NUMBER.values()].at(-1) ?? 1

async function getValidCrags(): Promise<Ascent['crag'][]> {
  const ascents = await getAllAscents()
  return ascents.map(({ crag }) => crag?.trim()).filter((crag) =>
    crag !== undefined  && crag !== ''
  )
}

export const list = orpcServer.crags.list.handler(
  async () => {
    const validCrags = await getValidCrags()
    return [...new Set(validCrags)].sort()
  },
)

export const frequency = orpcServer.crags.frequency.handler(
  async () => {
    const validCrags = await getValidCrags()
    return sortNumericalValues(
      calcFrequency(validCrags),
      false,
    )
  },
)

export const mostSuccessful = orpcServer.crags.mostSuccessful.handler(
  async ({ input }) => {
    const weightedByGrade = input?.weightByGrade ?? false

    const ascents = await getAllAscents()
    const validCrags = await getValidCrags()

    const weightedByGradeAndSortedCrags = [...new Set(validCrags)].reduce(
      (acc, crag) => {
        const listOfAscentsInCrag = ascents.filter((
          { crag: ascentCrag },
        ) => stringEqualsCaseInsensitive(crag, ascentCrag.trim()))

        const totalWeightedGrade = listOfAscentsInCrag.reduce(
          (acc, { topoGrade }) =>
            acc +
            (weightedByGrade
              ? convertGradeToNumber(topoGrade as Grade) / highestGradeNumber
              : 1),
          0,
        )

        return {
          ...acc,
          [crag]: totalWeightedGrade,
        }
      },
      {} as Record<string, number>,
    )

    const sortedCragsByNumber = sortNumericalValues(
      weightedByGradeAndSortedCrags,
      false,
    )

    const mostSuccessfulCrags: Record<string, number> = Object.fromEntries(
      Object.entries(sortedCragsByNumber).map<[string, number]>(
        ([crag, number]) => {
          const daysClimbedInCrag = new Set(
            ascents.filter(({ crag: ascentCrag }) =>
              stringEqualsCaseInsensitive(crag, ascentCrag.trim())
            ).map(({ date }) => date),
          ).size

          return [crag, number / daysClimbedInCrag]
        },
      ).sort(([, a], [, b]) => b - a),
    )

    const mostSuccessfulCragKeys = objectKeys(mostSuccessfulCrags)

    if (mostSuccessfulCragKeys.length === 0) {
      return mapObject(mostSuccessfulCrags, () => 0)
    }

    const highestScore = mostSuccessfulCrags[mostSuccessfulCragKeys[0]]
    return mapObject(
      mostSuccessfulCrags,
      (val) => highestScore ? Number((val / highestScore).toFixed(1)) : 0,
    )
  },
)

export const duplicates = orpcServer.crags.duplicates.handler(
  async () => {
    const validCrags = await getValidCrags()

    return findSimilar(validCrags)
  },
)

export const similar = orpcServer.crags.similar.handler(
  async () => {
    const validCrags = await getValidCrags()
    const groupedStrings = groupSimilarStrings(validCrags, 2)

    return Object.fromEntries(groupedStrings)
  },
)
