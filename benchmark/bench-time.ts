import { apiTestCases, baseURL, TEST_PORT } from './test-data.ts'

apiTestCases.forEach(({ name, normalize, endpoint }) => {
  Deno.bench(name, {
    baseline: !normalize,
    group: name.toLowerCase().includes('ascents') ? 'ascent' : 'training',
  }, async () => {
    try {
      await fetch(
        `${baseURL}/${endpoint}${normalize ? '?normalize=true' : ''}`,
      )
    } catch (error) {
      globalThis.console.error(`Failed to fetch ${name}: ${error}.
Is the development server ("http://localhost:${TEST_PORT}") running?`)
    }
  })
})
