export type Cache<T> = {
  data: T
  timestamp: number
} | undefined

type CreateCacheOutput<T> = {
  getCache: () => T | undefined
  setCache: (data: T) => void
  clearCache: () => void
}

// Create cache expiry duration
const tenMinutesInMs = 10 * 60 * 1000
const defaultCacheExpiryDurationInMs = tenMinutesInMs

export function createCache<T>(
  options?: { expiryDurationInMs?: number },
): CreateCacheOutput<T> {
  let cache: Cache<T> = undefined

  const expiryDuration = options?.expiryDurationInMs ??
    defaultCacheExpiryDurationInMs

  function getCache(): T | undefined {
    const isCacheValid = cache !== undefined &&
      (Date.now() - cache.timestamp) < expiryDuration

    if (!cache || !isCacheValid) return

    return cache.data
  }

  function setCache(data: T): void {
    cache = { data, timestamp: Date.now() }
  }

  function clearCache(): void {
    cache = undefined
  }

  return { getCache, setCache, clearCache }
}
