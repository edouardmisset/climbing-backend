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
const TEN_MINUTES_IN_MS = 10 * 60 * 1000
const DEFAULT_CACHE_EXPIRY_DURATION_IN_MS = TEN_MINUTES_IN_MS

export function createCache<T>(
  options?: { expiryDurationInMs?: number },
): CreateCacheOutput<T> {
  let cache: Cache<T> = undefined

  const expiryDuration = options?.expiryDurationInMs ??
    DEFAULT_CACHE_EXPIRY_DURATION_IN_MS

  function getCache(): T | undefined {
    if (!cache) return undefined

    const isCacheValid = (Date.now() - cache.timestamp) < expiryDuration
    if (!isCacheValid) return undefined

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
