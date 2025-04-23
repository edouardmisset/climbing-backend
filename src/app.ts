import { otel } from '@hono/otel'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { CORSPlugin } from '@orpc/server/plugins'
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
import { logger } from 'hono/logger'
import { endTime, startTime, timing } from 'hono/timing'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { api } from 'routes/mod.ts'
import { router } from 'routes/otrpc-server.ts'
import { backupAscentsAndTrainingFromGoogleSheets } from 'scripts/import-training-and-ascent-data-from-gs.ts'
import { pages } from './client/pages/index.tsx'

await load({ export: true })
const env = Deno.env.toObject()
const ENV = env.ENV

const openapiHandler = new OpenAPIHandler(router, {
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
  ],
})

let timestamp = 0

startOpenTelemetry()

const app = new Hono().use(cors(), trimTrailingSlash())
  .use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
  .use('/api/*', otel())
  .use('/openapi/*', async (c, next) => {
    const { matched, response } = await openapiHandler.handle(c.req.raw, {
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
      const throttleTimeInMinutes = 5
      const throttleTimeInMs = 1000 * 60 * throttleTimeInMinutes
      if (Date.now() - timestamp < throttleTimeInMs) {
        c.status(200)
        return c.json({
          status: 'failure',
          message:
            `Backup was triggered less than ${throttleTimeInMinutes} min ago.`,
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
            message: 'Backup failed due to an internal server error.',
          },
          500,
        )
      }

      return c.json({ status: 'success' }, 200)
    } catch (error) {
      globalThis.console.error(error)
      return c.json({
        error: error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      }, 500)
    }
  })
  .route('/api', api)
  .route('/', pages)
  .notFound((c) => {
    globalThis.console.log('Route not found', c.req.url)
    return c.json({ message: 'Line Not Found' }, 404)
  })

if (ENV === 'production') app.use(etag({ weak: true }), csrf(), compress())
if (ENV === 'dev') app.use(timing(), logger())

registerShutdownHandlers()

export default app
