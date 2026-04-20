import { DEFAULT_CACHE_TTL_MS } from '../constants.ts'

export type Cache<T> = {
  data: T
  timestamp: number
} | undefined

type CreateCacheOutput<T> = {
  getCache: () => T | undefined
  setCache: (data: T) => void
  clearCache: () => void
}

export function createCache<T>(
  options?: { expiryDurationInMs?: number },
): CreateCacheOutput<T> {
  let cache: Cache<T> = undefined

  const expiryDuration = options?.expiryDurationInMs ?? DEFAULT_CACHE_TTL_MS

  function getCache(): T | undefined {
    if (!cache) return undefined

    const isCacheValid = (Date.now() - cache.timestamp) < expiryDuration
    if (!isCacheValid) {
      cache = undefined
      return undefined
    }

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
