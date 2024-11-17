import { load } from '@std/dotenv'
import { blue, bold, green } from '@std/fmt/colors'
import { inspectRoutes } from 'hono/dev'
import { getAllAscents } from 'services/ascents.ts'
import { getAllTrainingSessions } from 'services/training.ts'
import { app } from './app.ts'

await load({ export: true })
export const env = Deno.env.toObject()
const FALLBACK_PORT = 8000

const port = Number(env.PORT) || FALLBACK_PORT
Deno.serve({ port }, app.fetch)

if (env.ENV === 'dev') {
  // Display the "GET" routes in the console for easy access during development.
  displayRoutes()

  // Once the server is started, we fetch the data from the DB and cache it to
  // improve the first query's response time.
  // Note: This is a one-time operation. So it only works if the client asks a
  // query within the `expiryDuration` period.
  // See @createCache in `src/server/helpers/cache.ts`.
  await getAllAscents()
  await getAllTrainingSessions()
}

function displayRoutes(): void {
  inspectRoutes(app)
    .filter(({ method, isMiddleware }) => method === 'GET' && !isMiddleware)
    .forEach(({ path }) => {
      const domain = `http://localhost:${port}`

      if (path.startsWith('/api')) {
        globalThis.console.log(`${domain}${green(bold(path))}`)
      } else {
        globalThis.console.log(`${domain}${blue(bold(path))}`)
      }
    })
}
