import { Bench } from 'npm:tinybench'
import { apiTestCases, baseURL } from './test-data.ts'

export async function runTimeBench(): Promise<void> {
  const bench = new Bench({ time: 100, iterations: 200 })

  apiTestCases.forEach(({ name, normalize, endpoint }) => {
    bench.add(name, async () => {
      try {
        await fetch(
          `${baseURL}/${endpoint}${normalize ? '?normalize=true' : ''}`,
        )
      } catch (error) {
        console.error(`Failed to fetch ${name}: ${error.message}.
Is the development server ("http://localhost:8000") running?`)
      }
    })
  })

  await bench.warmup()
  await bench.run()

  console.log('Time')

  console.table(bench.table())
}
