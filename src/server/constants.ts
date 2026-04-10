/**
 * Application-wide constants
 */

// Cache configuration
export const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

// Server configuration
export const FALLBACK_PORT = 8000

// Backup configuration
export const BACKUP_THROTTLE_MINUTES = 5
export const BACKUP_THROTTLE_MS = BACKUP_THROTTLE_MINUTES * 60 * 1000

// Search configuration
export const FUZZY_SEARCH_THRESHOLD = 0.7
export const DEFAULT_SEARCH_LIMIT = 100
export const DEFAULT_SMALL_SEARCH_LIMIT = 10
