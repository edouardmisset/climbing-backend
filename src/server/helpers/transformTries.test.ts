import { assertEquals, assertThrows } from '@std/assert'
import { transformTriesGSToJS, transformTriesJSToGS } from './transformers.ts'

Deno.test('transformTriesGSToJS parses style and tries', () => {
  assertEquals(transformTriesGSToJS('01 Flash'), { style: 'Flash', tries: 1 })
  assertEquals(transformTriesGSToJS('001 Onsight'), {
    style: 'Onsight',
    tries: 1,
  })
  assertEquals(transformTriesGSToJS('03 go'), { style: 'Redpoint', tries: 3 })
})

Deno.test('transformTriesJSToGS formats correctly', () => {
  assertEquals(transformTriesJSToGS({ style: 'Flash', tries: 1 }), '01 Flash')
  assertEquals(
    transformTriesJSToGS({ style: 'Onsight', tries: 1 }),
    '001 Onsight',
  )
  assertEquals(transformTriesJSToGS({ style: 'Redpoint', tries: 3 }), '03 go')
})

Deno.test('transformTriesJSToGS errors', () => {
  assertThrows(
    () => transformTriesJSToGS({ style: 'Redpoint', tries: 1 }),
    Error,
    'Redpoint ascents require more than 1 try',
  )
  assertThrows(
    () => transformTriesJSToGS({ style: 'Flash', tries: 2 }),
    Error,
    'must have exactly 1 try',
  )
  assertThrows(
    () => transformTriesJSToGS({ style: 'Onsight', tries: 2 }),
    Error,
    'must have exactly 1 try',
  )
  assertThrows(
    () => transformTriesJSToGS({ style: 'Flash', tries: 0 }),
    Error,
    'at least 1',
  )
})
