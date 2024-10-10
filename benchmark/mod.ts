import api from '../src/api.ts'
import { runSpaceBench } from './bench-space.ts'
import { TEST_PORT } from './test-data.ts'
const { log, clear } = globalThis.console

Deno.env.set('ENV', 'production')

clear()

log('\x1b[36m%s\x1b[0m', '\n 🚀 Starting server... \n')
const httpServer = Deno.serve(
  { port: TEST_PORT },
  (req) => api.fetch(req, { ENV: Deno.env.get('ENV') }),
)

log('\x1b[33m%s\x1b[0m', '\n ⏱️  Benchmarking time... \n')
const timeBench = new Deno.Command(
  'deno',
  {
    args: ['bench', '--allow-net', './benchmark/bench-time.ts'],
    stdout: 'inherit',
    stderr: 'inherit',
  },
)
await timeBench.output()

log('\x1b[32m%s\x1b[0m', '\n 📦 Benchmarking size... \n')
await runSpaceBench()

log('\x1b[31m%s\x1b[0m', '\n 🔌 Shutting down server... \n')
await httpServer.shutdown()
