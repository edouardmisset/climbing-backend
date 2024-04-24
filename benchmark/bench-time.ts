import { Bench, Options } from 'npm:tinybench@2.8.0'
import { apiTestCases, baseURL, TEST_PORT } from './test-data.ts'

export async function runTimeBench(options?: Options): Promise<void> {
  const { time = 100, iterations = 200 } = options || {}
  const bench = new Bench({ time, iterations })

  apiTestCases.forEach(({ name, normalize, endpoint }) => {
    bench.add(name, async () => {
      try {
        await fetch(
          `${baseURL}/${endpoint}${normalize ? '?normalize=true' : ''}`,
        )
      } catch (error) {
        globalThis.console.error(`Failed to fetch ${name}: ${error.message}.
Is the development server ("http://localhost:${TEST_PORT}") running?`)
      }
    })
  })

  await bench.warmup()
  await bench.run()

  globalThis.console.log('Time')

  globalThis.console.table(bench.table())
}
