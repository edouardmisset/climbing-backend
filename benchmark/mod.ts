import api from '../src/server.ts'
import { runSpaceBench } from './bench-space.ts'
import { runTimeBench } from './bench-time.ts'
import { TEST_PORT } from './test-data.ts'

globalThis.console.log('Starting server...')
const httpServer = Deno.serve(
  { port: TEST_PORT },
  (req) => api.fetch(req, { ENV: 'production' }),
)

globalThis.console.log('Benchmarking time...')
await runTimeBench()
globalThis.console.log('Benchmarking size...')
await runSpaceBench()

globalThis.console.log('Shutting down server...')
await httpServer.shutdown()
