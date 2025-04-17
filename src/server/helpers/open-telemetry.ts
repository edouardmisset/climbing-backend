import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
})

export function startOpenTelemetry(): void {
  sdk.start()
}

export async function shutdownOpenTelemetry(): Promise<void> {
  await sdk.shutdown()
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
