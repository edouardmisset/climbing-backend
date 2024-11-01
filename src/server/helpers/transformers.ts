import { invert, isValidNumber } from '@edouardmisset/utils'
import type { Ascent } from 'schema/ascent.ts'
import type { TrainingSession } from 'schema/training.ts'

type TransformFunctionGSToJS = (value: string) => string | number

/* ---------------------------------------------
 *                   HEADERS
 * ---------------------------------------------
 */

//! The order of the headers matters. For this reason we define the headers in
//! the right order in a separate array.
export const ASCENT_HEADERS =
  [
    'Route Name',
    'Topo Grade',
    '# Tries',
    'My Grade',
    'Height',
    'Profile',
    'Holds',
    'Rating',
    'Route / Boulder',
    'Crag',
    'Area',
    'Departement',
    'Date',
    'Climber',
    'Ascent Comments',
  ] as const



export const TRANSFORMED_ASCENT_HEADER_NAMES = {
  'Route Name': 'routeName',
  'Topo Grade': 'topoGrade',
  '# Tries': 'tries',
  'My Grade': 'personalGrade',
  'Height': 'height',
  'Profile': 'profile',
  'Holds': 'holds',
  'Rating': 'rating',
  'Route / Boulder': 'climbingDiscipline',
  'Crag': 'crag',
  'Area': 'area',
  'Departement': 'region',
  'Date': 'date',
  'Climber': 'climber',
  'Ascent Comments': 'comments',
} as const satisfies Record<typeof ASCENT_HEADERS[number], string>

export type GSAscentKeys = keyof typeof TRANSFORMED_ASCENT_HEADER_NAMES
type JSAscentKeys = typeof TRANSFORMED_ASCENT_HEADER_NAMES[GSAscentKeys]

export const TRANSFORMED_ASCENT_KEYS = invert(TRANSFORMED_ASCENT_HEADER_NAMES)

export const TRANSFORMED_TRAINING_HEADER_NAMES = {
  'Anatomical Region': 'anatomicalRegion',
  Comments: 'comments',
  Date: 'date',
  'Energy System': 'energySystem',
  'Gym / Crag': 'gymCrag',
  Intensity: 'intensity',
  LOAD: 'load',
  'Route / Bouldering': 'climbingDiscipline',
  'Type of Session': 'sessionType',
  Volume: 'volume',
} as const

export type GSTrainingKeys = keyof typeof TRANSFORMED_TRAINING_HEADER_NAMES
export type JSTrainingKeys =
  typeof TRANSFORMED_TRAINING_HEADER_NAMES[GSTrainingKeys]

/**
 * NB: there is one more key (`style`) in the JS object than in the GS headers
 */
export const TRANSFORMED_TRAINING_KEYS = invert(
  TRANSFORMED_TRAINING_HEADER_NAMES,
)

/* ---------------------------------------------
 *                   TRANSFORMS
 *
 *           Google Sheet => JavaScript
 * ---------------------------------------------
 */

/**
 * Transforms a value to a string.
 * @param {string} value - The value to transform.
 * @returns {string} - The transformed string value.
 */
const transformToStringGSToJS: TransformFunctionGSToJS = (value) =>
  String(value)

/**
 * Transforms a date string from "DD/MM/YYYY" format to ISO string.
 * @param {string} value - The date string to transform.
 * @returns {string} - The transformed ISO date string.
 */
const transformDateGSToJS: TransformFunctionGSToJS = (value) => {
  const [day, month, year] = value.split('/')
  return new Date(`${year}-${month}-${day}T12:00:00Z`).toISOString()
}

/**
 * Transforms a height string by removing 'm' and converting to a number.
 * @param {string} value - The height string to transform.
 * @returns {number} - The transformed number value.
 */
const transformHeightGSToJS: TransformFunctionGSToJS = (value) =>
  Number(value.replace('m', ''))

/**
 * Transforms a rating string by removing '*' and converting to a number.
 * @param {string} value - The rating string to transform.
 * @returns {number} - The transformed number value.
 */
const transformRatingGSToJS: TransformFunctionGSToJS = (value) =>
  Number(value.replace('*', ''))

type ClimbingAttempt = {
  style: 'Onsight' | 'Flash' | 'Redpoint'
  tries: number
}

/**
 * Transforms a tries string to extract style and number of tries.
 * @param {string} value - The tries string to transform.
 * @returns {{ style: 'Onsight' | 'Flash' | 'Redpoint', tries: number }} - The transformed style and tries.
 */
export function transformTriesGSToJS(
  value: string,
): ClimbingAttempt {
  const style = value.includes('Onsight')
    ? 'Onsight'
    : value.includes('Flash')
      ? 'Flash'
      : 'Redpoint'

  const tries = Number(
    value.replace('go', '').replace('Onsight', '').replace('Flash', '').trim(),
  )

  return { style, tries }
}

/**
 * Transforms a session type string.
 * @param {string} value - The session type string to transform.
 * @returns {string} - The transformed session type.
 */
const transformSessionTypeGSToJS: TransformFunctionGSToJS = (
  value,
) => (value === 'Ex' ? 'Out' : value)

/**
 * Transforms a climbing discipline string.
 * @param {string} value - The climbing discipline string to transform.
 * @returns {string} - The transformed climbing discipline.
 */
const transformClimbingDisciplineGSToJS: TransformFunctionGSToJS = (
  value,
) => (value === 'Bouldering' ? 'Boulder' : value)

/**
 * Default transformation function that attempts to convert a string to a number.
 * @param {string} value - The value to transform.
 * @returns {string | number} - The transformed value as a number or string.
 */
const defaultTransformGSToJS: TransformFunctionGSToJS = (value) => {
  const valueAsNumber = Number(value)
  return isValidNumber(valueAsNumber) ? valueAsNumber : value
}

type TransformFunctionMappingGSToJS = Partial<
  Record<
    JSAscentKeys | JSTrainingKeys | 'default',
    TransformFunctionGSToJS
  >
>

export const TRANSFORM_FUNCTIONS_GS_TO_JS = {
  area: transformToStringGSToJS,
  date: transformDateGSToJS,
  height: transformHeightGSToJS,
  rating: transformRatingGSToJS,
  routeName: transformToStringGSToJS,
  sessionType: transformSessionTypeGSToJS,
  climbingDiscipline: transformClimbingDisciplineGSToJS,
  default: defaultTransformGSToJS,
} as const satisfies TransformFunctionMappingGSToJS

/* ---------------------------------------------
 *                   TRANSFORMS
 *
 *            JavaScript => Google Sheet
 * ---------------------------------------------
 */

// deno-lint-ignore no-explicit-any
export type TransformFunctionJSToGS = (value: any) => string

/**
 * Transforms a value to a string.
 * @param {any} value - The value to transform.
 * @returns {string} - The transformed string value.
 */
const transformToStringJSToGS = (value: unknown): string => String(value)

/**
 * Transforms an ISO date string to "DD/MM/YYYY" format.
 * @param {Ascent['date']} ISODateString - The ISO date string to transform.
 * @returns {string} - The transformed date string in "DD/MM/YYYY" format.
 */
const transformDateJSToGS = (ISODateString: Ascent['date']): string => {
  const date = new Date(ISODateString)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Transforms a height number to a string with 'm'.
 * @param {Ascent['height']} height - The height number to transform.
 * @returns {string} - The transformed height string.
 */
const transformHeightJSToGS = (height: Ascent['height']): string => `${height}m`

/**
 * Transforms a rating number to a string with '*'.
 * @param {Ascent['rating']} rating - The rating number to transform.
 * @returns {string} - The transformed rating string.
 */
const transformRatingJSToGS = (rating: Ascent['rating']): string => `${rating}*`

/**
 * Transforms style and number of tries to a tries string.
 * @param {ClimbingAttempt} value - The style and tries to transform.
 * @returns {string} - The transformed tries string.
 */
const transformTriesJSToGS = (
  value: ClimbingAttempt,
): string => {
  if (value.style === 'Onsight') return '001 Onsight'
  if (value.style === 'Flash') return '01 Flash'

  return `${value.tries.toString().padStart(2, '0')} go`
}

/**
 * Transforms a session type string.
 * @param {NonNullable<TrainingSession['sessionType']>} sessionType - The session type string to transform.
 * @returns {string} - The transformed session type.
 */
const transformSessionTypeJSToGS = (
  sessionType: NonNullable<TrainingSession['sessionType']>,
): string => sessionType === 'Out' ? 'Ex' : sessionType

/**
 * Transforms a climbing discipline string.
 * @param {string} discipline - The climbing discipline string to transform.
 * @returns {string} - The transformed climbing discipline.
 */
const transformClimbingDisciplineJSToGS = (
  discipline: Ascent['climbingDiscipline'],
): string => discipline === 'Boulder' ? 'Bouldering' : discipline

type TransformFunctionMappingJSToGS = Partial<
  Record<
    JSAscentKeys | JSTrainingKeys | 'default' | 'style',
    TransformFunctionJSToGS
  >
>

export const TRANSFORM_FUNCTIONS_JS_TO_GS = {
  area: transformToStringJSToGS,
  date: transformDateJSToGS,
  height: transformHeightJSToGS,
  rating: transformRatingJSToGS,
  routeName: transformToStringJSToGS,
  sessionType: transformSessionTypeJSToGS,
  climbingDiscipline: transformClimbingDisciplineJSToGS,
  default: transformToStringJSToGS,

  tries: transformTriesJSToGS,
  // You need to catch the case for the `style` property not being mapped to
  // anything
} satisfies TransformFunctionMappingJSToGS
