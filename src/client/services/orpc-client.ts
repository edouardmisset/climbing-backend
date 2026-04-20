import { createORPCClient } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { contract } from 'contracts/contract.ts'
import { PORT } from '~/env.ts'
import { BatchLinkPlugin, ClientRetryPlugin } from '@orpc/client/plugins'

const link = new OpenAPILink(contract, {
  url: `http://127.0.0.1:${PORT}/openapi`,
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

export const orpc: JsonifiedClient<
  ContractRouterClient<typeof contract>
> = createORPCClient(link)
