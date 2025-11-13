import { otel } from '@hono/otel'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { BatchHandlerPlugin, CORSPlugin } from '@orpc/server/plugins'
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod'
import { load } from '@std/dotenv'
import {
  registerShutdownHandlers,
  startOpenTelemetry,
} from 'helpers/open-telemetry.ts'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { serveStatic } from 'hono/deno'
import { etag } from 'hono/etag'
import { logger as requestLogger } from 'hono/logger'
import { endTime, startTime, timing } from 'hono/timing'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { logger as log } from 'helpers/logger.ts'
import { router } from 'routes/routes.ts'
import { backupAscentsAndTrainingFromGoogleSheets } from './server/scripts/import-trainings-and-ascents-from-gs.ts'
import { pages } from './client/pages/index.tsx'
import {
  BACKUP_THROTTLE_MINUTES,
  BACKUP_THROTTLE_MS,
} from './server/constants.ts'

await load({ export: true })
const env = Deno.env.toObject()
const ENV = env.ENV

const openApiHandler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin(
      { exposeHeaders: ['Content-Disposition'] },
    ),
    new ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [
        new ZodToJsonSchemaConverter(),
      ],
      specGenerateOptions: {
        info: {
          title: 'Climbing API',
          version: '0.1.0',
        },
      },
    }),
    new BatchHandlerPlugin(),
  ],
})

let timestamp = 0

if (import.meta.main) {
  startOpenTelemetry()
}

const app = new Hono().use(cors(), trimTrailingSlash())
  .use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
  .use('/api/*', otel())
  .use('/openapi/*', async (c, next) => {
    const { matched, response } = await openApiHandler.handle(c.req.raw, {
      prefix: '/openapi',
      context: {}, // Provide initial context if needed
    })

    if (matched) {
      return c.newResponse(response.body, response)
    }

    await next()
  })
  .all('/api/backup', async (c) => {
    try {
      if (Date.now() - timestamp < BACKUP_THROTTLE_MS) {
        // Too Many Requests (throttled)
        c.status(429)
        return c.json({
          status: 'failure',
          code: 'BACKUP_THROTTLED',
          retryAfterMinutes: BACKUP_THROTTLE_MINUTES,
          message:
            `Backup was triggered less than ${BACKUP_THROTTLE_MINUTES} min ago.`,
        })
      }

      startTime(
        c,
        'backup',
        'Backing up ascents and training from Google Sheets',
      )
      const success = await backupAscentsAndTrainingFromGoogleSheets()
      endTime(c, 'backup')
      timestamp = Date.now()

      if (!success) {
        return c.json(
          {
            status: 'failure',
            code: 'BACKUP_FAILED',
            message: 'Backup failed due to an internal server error.',
          },
          500,
        )
      }

      return c.json({ status: 'success', code: 'BACKUP_SUCCESS' }, 200)
    } catch (error) {
      log.error('Backup endpoint error', error)
      return c.json({
        status: 'failure',
        code: 'BACKUP_ERROR',
        message: error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      }, 500)
    }
  })
  .route('/', pages)
  .notFound((c) => {
    const notFoundMessage = 'Route Not Found'
    log.warn(notFoundMessage, { url: c.req.url })
    return c.json({ message: notFoundMessage }, 404)
  })

if (ENV === 'production') app.use(etag({ weak: true }), csrf(), compress())
if (ENV === 'dev') app.use(timing(), requestLogger())

registerShutdownHandlers()

export default app
