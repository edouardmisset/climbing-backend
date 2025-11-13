import { assertEquals } from '@std/assert'
import { createCache } from './cache.ts'

Deno.test('createCache basic set/get', () => {
  const { setCache, getCache } = createCache<number>()
  assertEquals(getCache(), undefined)
  setCache(42)
  assertEquals(getCache(), 42)
})

Deno.test('createCache expiry', () => {
  const { setCache, getCache } = createCache<number>({ expiryDurationInMs: 5 })
  setCache(10)
  // Immediately available
  assertEquals(getCache(), 10)
  // Simulate delay past expiry by monkey patching Date.now
  const originalNow = Date.now
  ;(Date as unknown as { now: () => number }).now = () => originalNow() + 10
  try {
    assertEquals(getCache(), undefined)
  } finally {
    ;(Date as unknown as { now: () => number }).now = originalNow
  }
})

Deno.test('createCache clearCache', () => {
  const { setCache, getCache, clearCache } = createCache<string>()
  setCache('hello')
  assertEquals(getCache(), 'hello')
  clearCache()
  assertEquals(getCache(), undefined)
})
