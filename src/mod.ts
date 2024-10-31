import { blue, bold, green } from '@std/fmt/colors'
import { inspectRoutes } from 'hono/dev'
import { getAllAscents } from 'services/ascents.ts'
import { getTrainingSessions } from 'services/training.ts'
import { app, FALLBACK_PORT } from './app.ts'

const port = Number(Deno.env.get('PORT')) || FALLBACK_PORT
Deno.serve({ port }, app.fetch)

if (Deno.env.get('ENV') === 'dev') {
  // Display the "GET" routes in the console for easy access during development.
  displayRoutes()

  // Once the server is started, we fetch the data from the DB and cache it to
  // improve the first query's response time.
  // Note: This is a one-time operation. So it only works if the client asks a
  // query within the `expiryDuration` period.
  // See @createCache in `src/server/helpers/cache.ts`.
  await getAllAscents()
  await getTrainingSessions()
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
