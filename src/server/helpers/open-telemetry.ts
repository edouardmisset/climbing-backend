import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
})

let hasOpenTelemetryStarted = false

export function startOpenTelemetry(): void {
  sdk.start()
  globalThis.console.log('OpenTelemetry SDK started successfully.')
  hasOpenTelemetryStarted = true
}

export async function shutdownOpenTelemetry(): Promise<void> {
  if (!hasOpenTelemetryStarted) return

  try {
    await sdk.shutdown()
    globalThis.console.log('OpenTelemetry SDK shut down successfully.')
    hasOpenTelemetryStarted = false
  } catch (error) {
    globalThis.console.error('Error during shutdown:', error)
  }
}

// After all your routes and exports, add the global shutdown handlers
export function registerShutdownHandlers(): void {
  const handleShutdown = async (signal: string) => {
    globalThis.console.log(`${signal} received, shutting down tracing...`)
    await shutdownOpenTelemetry()
    globalThis.console.log('Tracing SDK shut down.')
    Deno.exit()
  }

  Deno.addSignalListener('SIGTERM', () => handleShutdown('SIGTERM'))
  Deno.addSignalListener('SIGINT', () => handleShutdown('SIGINT'))
}
