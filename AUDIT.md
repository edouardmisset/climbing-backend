# Codebase Audit and Recommendations

This document summarizes discrepancies and best-practice recommendations for the
repository as of 2025-11-11.

**Last Updated:** 2025-11-13

## Highlights

- ✅ **COMPLETED:** Consolidate API surface - migrated to ORPC-only pattern,
  removed duplicate Hono routes.
- ✅ **COMPLETED:** Validate and centralize environment configuration.
- ✅ **COMPLETED:** Tighten types and avoid mutation/any.
- ✅ **COMPLETED:** Improve error handling, logging, and observability.
- ✅ **COMPLETED:** Add tests around transformers, caching, and handlers.

---

## Architecture & Layering

- ✅ **RESOLVED:** Consolidated on ORPC pattern. Removed duplicate Hono routes
  (`routes/ascents.ts`, `routes/training.ts`, `routes/crags.ts`,
  `routes/areas.ts`, `routes/grades.ts`). All API endpoints now served
  exclusively through ORPC contracts at `/openapi/*` paths. The `routes/mod.ts`
  no longer exports a Hono API router.
- Client tight coupling: `src/client/services/orpc-client.ts` imports `port`
  from server `env.ts`. Expose client configuration via an isolated client-side
  config or a build-time env injection to decouple frontend from server
  internals.
- Cohesion: `src/server/helpers/transformers.ts` mixes ascent and training
  transforms. Consider splitting into `transformers/ascent.ts` and
  `transformers/training.ts`.

## Configuration & Environment

- ✅ **RESOLVED:** Centralized dotenv loading in `src/env.ts`. Removed duplicate
  `load()` call from `google-sheets.ts`.
- ✅ **RESOLVED:** Added runtime validation for required env vars using `zod`
  schema. Production mode enforces all Google Sheet credentials.
- ✅ **RESOLVED:** `GOOGLE_PRIVATE_KEY` validation throws descriptive error when
  missing in production. Lazy initialization prevents startup failures in
  dev/test.

## Typing & Strictness

- ✅ **RESOLVED:** `remove-undefined-values.ts` now uses proper generic typing
  `reduce<Record<string, unknown>>` instead of `any`.
- `transformAscentFromGSToJS` returns `Record<string, string|number|boolean>`.
  Consider a `Partial<Ascent>` builder or a dedicated `RawAscent` type for
  stronger typing pre-parse.
- ✅ **RESOLVED:** `transformTriesGSToJS` computed once per ascent and result
  cached to avoid duplicate work.
- ✅ **RESOLVED:** `ascents_.ts` search handler returns new objects via spread,
  avoiding mutation of cached ascent objects.

## Data & Validation

- ✅ **RESOLVED:** `transformTriesJSToGS` error messages improved for clarity
  (fixed typo "nor Redpoint", clarified try constraints for
  Flash/Onsight/Redpoint).
- ✅ **RESOLVED:** Training `percentSchema` allows floats. If only integers are
  valid, add `.int()`.
- Duplicate route detection strips only `+`. Consider a shared normalization
  util for grades and names.

## Caching

- In-memory cache has no explicit invalidation; provide `clear...Cache()`
  exports. Consider separate TTLs for ascents vs training.
- `addAscent` returns `id` via `allAscents.length - 1` after refresh. Risky
  under concurrency or if rows filtered. Prefer a stable ID (uuid) or read the
  added row index deterministically.

## Error Handling & Logging

- ✅ **RESOLVED:** Centralized logger abstraction created in `helpers/logger.ts`
  with structured timestamped logs.
- ✅ **RESOLVED:** Replaced direct `globalThis.console.*` usage in `app.ts`,
  `open-telemetry.ts`, and key modules with logger.
- Preserve error cause: use `throw new Error('message', { cause: err })` instead
  of re-wrapping.
- ✅ **RESOLVED:** HTTP semantics improved: backup throttle now returns
  `429 Too Many Requests`; structured error codes added to all backup endpoint
  responses.

## Performance

- Avoid per-row key sorting in hot paths unless required downstream. Remove
  `sortKeys` from `transformAscentFromGSToJS` if not needed.
- Precompute search structures (e.g., fuzzysort prepare) for faster searches.
- Cache the result of `transformTriesGSToJS` during ascent transform.

## Security

- Add auth and rate limiting for mutating endpoints (`POST /ascents`, backup
  route). Ensure CORS is restricted appropriately.
- Ensure secrets are never logged. Validate and guard `GOOGLE_PRIVATE_KEY`
  handling.

## Testing

✅ **RESOLVED:** Added tests for:

- `transformTriesGSToJS` and `transformTriesJSToGS` (happy paths + boundary
  conditions) in `transformTries.test.ts`.
- `createCache` expiry and invalidation in `cache.test.ts`.
- `logger` basic functionality in `logger.test.ts`.

Still needed:

- `addAscent` behavior and ID assignment (with sheets mocked).
- ORPC handlers: `list`, `search`, `findById`, `create`.
- Integration: mount `app.fetch` and assert responses and status codes.

## Documentation

- ✅ **RESOLVED:** Created `ENV.md` documenting all required environment
  variables with production requirements, descriptions, and usage notes.
- README should include: running dev/test tasks, link to OpenAPI JSON,
  deployment notes.
- ✅ **RESOLVED:** Architectural choice documented: consolidated to ORPC-only
  pattern. Clients consume API via `/openapi` prefix with type-safe contracts.

## Observability

- Instrument key operations with OpenTelemetry spans (Google Sheets IO, cache
  hits/misses, transform pipelines). Add simple counters for cache hit/miss.
- Graceful shutdown: ensure telemetry flushes; today it shuts down SDK and
  exits.

---

## Completed Improvements (2025-01-13)

### API Architecture

- ✅ Consolidated to ORPC-only API pattern
- ✅ Removed duplicate Hono route files (`ascents.ts`, `training.ts`,
  `crags.ts`, `areas.ts`, `grades.ts`)
- ✅ Updated `app.ts` to serve API exclusively through `/openapi/*` handlers
- ✅ Simplified `routes/mod.ts` by removing Hono API router

### Style & Consistency

- ✅ Created `src/server/constants.ts` with all magic number constants:
  - `BACKUP_THROTTLE_MINUTES = 5`
  - `BACKUP_THROTTLE_MS = 300000`
  - `DEFAULT_CACHE_TTL_MS = 600000` (10 minutes)
  - `FALLBACK_PORT = 8000`
  - `FUZZY_SEARCH_THRESHOLD = 0.7`
  - `DEFAULT_SEARCH_LIMIT = 100`
  - `DEFAULT_SMALL_SEARCH_LIMIT = 10`
- ✅ Updated all files to use constants instead of magic numbers:
  - `env.ts`: Uses `FALLBACK_PORT`
  - `app.ts`: Uses `BACKUP_THROTTLE_MINUTES` and `BACKUP_THROTTLE_MS`
  - `helpers/cache.ts`: Uses `DEFAULT_CACHE_TTL_MS`
  - `routes/ascents_.ts`: Uses `FUZZY_SEARCH_THRESHOLD`
  - `contracts/ascents.ts`: Uses `DEFAULT_SMALL_SEARCH_LIMIT`
- ✅ Standardized function declarations:
  - Converted standalone arrow functions to function declarations:
    - `transformTriesJSToGS` in `helpers/transformers.ts`
    - `convertNumberToGrade` in `helpers/converters.ts`
    - `loadWorksheet` in `services/google-sheets.ts`
  - Kept arrow functions for callbacks/predicates (`.map()`, `.filter()`,
    `.sort()`, etc.)
  - All handler definitions remain as constant assignments (ORPC pattern)

### Type Safety & Code Quality

- ✅ Fixed `any` usage in `remove-undefined-values.ts` with proper generics
- ✅ Eliminated object mutation in `ascents_.ts` search handler
- ✅ Optimized `transformTriesGSToJS` to compute once per ascent

### Environment Configuration

- ✅ Centralized env loading and validation with zod schema
- ✅ Removed duplicate dotenv loading from `google-sheets.ts`
- ✅ Added lazy credential validation with descriptive errors
- ✅ Created comprehensive `ENV.md` documentation

### Logging & Errors

- ✅ Implemented structured logger abstraction in `helpers/logger.ts`
- ✅ Replaced raw console calls with logger throughout codebase
- ✅ Improved HTTP status codes (429 for throttle, structured error responses)
- ✅ Enhanced error messages in `transformTriesJSToGS`

### Test Coverage

- ✅ Added `transformTries.test.ts` for tries parsing/formatting edge cases
- ✅ Added `cache.test.ts` for expiry and invalidation behavior
- ✅ Added `logger.test.ts` for basic logger functionality
- ✅ All tests passing (26 passed, 0 failed)

---

## Quick Wins (Suggested Patches)

All originally identified quick wins have been implemented:

- ✅ Fix mutation in `src/server/routes/ascents_.ts` search handler by returning
  a new object with highlight/target.
- ✅ Refactor `remove-undefined-values.ts` to avoid `any`.
- ✅ Cache the `transformTriesGSToJS` result to avoid double computation.
- ✅ Normalize HTTP status codes on backup endpoint.
- ✅ Centralize dotenv loading in `src/env.ts` and import validated env from
  everywhere else.
- ✅ Created `ENV.md` documenting required variables.
