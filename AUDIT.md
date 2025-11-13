# Codebase Audit and Recommendations

This document summarizes discrepancies and best-practice recommendations for the
repository as of 2025-11-11.

## Highlights

- Consolidate API surface: pick ORPC or raw Hono routes, avoid duplication.
- Validate and centralize environment configuration.
- Tighten types and avoid mutation/any.
- Improve error handling, logging, and observability.
- Add tests around transformers, caching, and handlers.

---

## Architecture & Layering

- Mixed paradigms: both REST-like Hono routes (`src/server/routes/ascents.ts`)
  and ORPC contract routes (`src/server/contracts/*` +
  `src/server/routes/*_.ts`). Duplicate logic (filtering, search, sorting).
  Recommendation: consolidate on ORPC contracts and remove Hono duplicates, or
  vice-versa, but keep one source of truth.
- Client tight coupling: `src/client/services/orpc-client.ts` imports `port`
  from server `env.ts`. Expose client configuration via an isolated client-side
  config or a build-time env injection to decouple frontend from server
  internals.
- Cohesion: `src/server/helpers/transformers.ts` mixes ascent and training
  transforms. Consider splitting into `transformers/ascent.ts` and
  `transformers/training.ts`.

## Configuration & Environment

- Duplicate dotenv loading: both `src/env.ts` and
  `src/server/services/google-sheets.ts` call `load()` and read env. Centralize
  env loading early and export a validated env object.
- No runtime validation for required env vars: e.g., spreadsheet IDs and
  `GOOGLE_PRIVATE_KEY`. Add `zod` schema to validate required vars; fail fast.
- `GOOGLE_PRIVATE_KEY` normalization silently accepts undefined. Throw
  descriptive error in production if missing.

## Typing & Strictness

- `remove-undefined-values.ts` uses `any` with a lint ignore. Prefer a typed
  accumulator: `reduce<Record<string, unknown>>`.
- `transformAscentFromGSToJS` returns `Record<string, string|number|boolean>`.
  Consider a `Partial<Ascent>` builder or a dedicated `RawAscent` type for
  stronger typing pre-parse.
- Duplicate work: `transformTriesGSToJS` is called twice per ascent; compute
  once and reuse.
- `ascents_.ts` search mutates `result.obj` with `Object.assign`, potentially
  polluting cached ascents. Return new objects via spread.

## Data & Validation

- `ascentSchema.shape.climber` transforms to a constant "Edouard Misset". If
  intentional, remove from input or document; otherwise respect user input.
- `transformTriesJSToGS` messaging: typo ("nor Redpoint"); semantics: tries==1
  with Redpoint should error, but message could clarify constraints. Also ensure
  tries==1 is allowed for Flash/Onsight only.
- Training `percentSchema` allows floats. If only integers are valid, add
  `.int()`.
- Duplicate route detection strips only `+`. Consider a shared normalization
  util for grades and names.

## Caching

- In-memory cache has no explicit invalidation; provide `clear...Cache()`
  exports. Consider separate TTLs for ascents vs training.
- `addAscent` returns `id` via `allAscents.length - 1` after refresh. Risky
  under concurrency or if rows filtered. Prefer a stable ID (uuid) or read the
  added row index deterministically.

## Error Handling & Logging

- Use a centralized logger abstraction; avoid direct `globalThis.console.*` in
  production code. Consider structured logs.
- Preserve error cause: use `throw new Error('message', { cause: err })` instead
  of re-wrapping.
- HTTP semantics: throttle on backup should be `429 Too Many Requests` rather
  than 200; backup failures 500; validation errors 400.

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

Add or expand tests for:

- `transformTriesGSToJS` and `transformTriesJSToGS` (happy paths + boundary
  conditions).
- `createCache` expiry and invalidation.
- `addAscent` behavior and ID assignment (with sheets mocked).
- ORPC handlers: `list`, `search`, `findById`, `create`.
- Integration: mount `app.fetch` and assert responses and status codes.

## Documentation

- README should include: env var list, how to obtain Google creds, running
  dev/test, link to OpenAPI JSON, deployment notes.
- Briefly document architectural choice (ORPC vs Hono) and how the client should
  consume the API.

## Style & Consistency

- Standardize constant naming (ALL_CAPS for runtime constants vs camelCase for
  variables). Extract magic numbers (throttle minutes, fuzzy threshold) into
  named constants.
- Prefer consistent function styles and file naming.

## Observability

- Instrument key operations with OpenTelemetry spans (Google Sheets IO, cache
  hits/misses, transform pipelines). Add simple counters for cache hit/miss.
- Graceful shutdown: ensure telemetry flushes; today it shuts down SDK and
  exits.

---

## Quick Wins (Suggested Patches)

- Fix mutation in `src/server/routes/ascents_.ts` search handler by returning a
  new object with highlight/target.
- Refactor `remove-undefined-values.ts` to avoid `any`.
- Cache the `transformTriesGSToJS` result to avoid double computation.
- Normalize HTTP status codes on backup endpoint.
- Centralize dotenv loading in `src/env.ts` and import validated env from
  everywhere else.

If you want, I can implement these quick wins in a follow-up PR and add a small
`ENV.md` documenting required variables.
