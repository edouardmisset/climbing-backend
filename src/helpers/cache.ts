export type Cache<T> = {
  data: T
  timestamp: number
} | undefined

export function createCache<T>(
  expiryDurationInMs: number,
): { getCache: () => T | undefined; setCache: (data: T) => void } {
  let cache: Cache<T> = undefined

  function getCache(): T | undefined {
    if (
      cache !== undefined && (Date.now() - cache.timestamp) < expiryDurationInMs
    ) {
      return cache.data
    }
  }

  function setCache(data: T): void {
    cache = { data, timestamp: Date.now() }
  }

  return { getCache, setCache }
}
