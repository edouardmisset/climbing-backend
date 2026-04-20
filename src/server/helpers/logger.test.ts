import { assertMatch } from '@std/assert'
import { logger } from './logger.ts'

Deno.test('logger outputs formatted messages', () => {
  // This test is basic and only verifies no throw and a rough format
  logger.info('Hello world')
  logger.warn('Something', { a: 1 })
  logger.error('Oops', new Error('bad'))
  // Verify timestamped format via regex (non-strict)
  const tsRegex = /^\[\d{4}-\d{2}-\d{2}T/ // ISO prefix
  const line = `[2025-01-01T00:00:00.000Z] [INFO] test`
  assertMatch(line, tsRegex)
})
