import { createORPCClient } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { contract } from 'contracts/contract.ts'
import { PORT } from '~/env.ts'
import { BatchLinkPlugin, ClientRetryPlugin } from '@orpc/client/plugins'

const DEFAULT_OPENAPI_URL = `http://127.0.0.1:${PORT}/openapi`

const toOpenApiUrl = (baseUrl: string): string => {
  return `${baseUrl.replace(/\/+$/, '')}/openapi`
}

export type OrpcClient = JsonifiedClient<
  ContractRouterClient<typeof contract>
>

export const getOrpcClient = (requestUrl?: string): OrpcClient => {
  const envBaseUrl = Deno.env.get('INTERNAL_API_BASE_URL')
  const requestBaseUrl = requestUrl ? new URL(requestUrl).origin : undefined
  const baseUrl = envBaseUrl ?? requestBaseUrl
  const openApiUrl = baseUrl ? toOpenApiUrl(baseUrl) : DEFAULT_OPENAPI_URL

  const link = new OpenAPILink(contract, {
    url: openApiUrl,
    plugins: [
      new BatchLinkPlugin({
        groups: [
          {
            condition: () => true,
            context: {}, // This context will represent the batch request and persist throughout the request lifecycle
          },
        ],
      }),
      new ClientRetryPlugin(),
    ],
  })

  return createORPCClient(link)
}

export const orpc = getOrpcClient()
