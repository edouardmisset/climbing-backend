type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function format(level: LogLevel, message: string, meta?: unknown): string {
  const ts = new Date().toISOString()
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`
  if (meta === undefined) return base
  try {
    const serialized = typeof meta === 'string' ? meta : JSON.stringify(meta)
    return `${base} ${serialized}`
  } catch {
    return base
  }
}

export const logger = {
  debug: (message: string, meta?: unknown) =>
    globalThis.console.debug(format('debug', message, meta)),
  info: (message: string, meta?: unknown) =>
    globalThis.console.info(format('info', message, meta)),
  warn: (message: string, meta?: unknown) =>
    globalThis.console.warn(format('warn', message, meta)),
  error: (message: string, meta?: unknown) =>
    globalThis.console.error(format('error', message, meta)),
}

export type Logger = typeof logger
