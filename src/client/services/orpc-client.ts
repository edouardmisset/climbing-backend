import { createORPCClient } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { routerContract } from '../../server/routes/otrpc-server.ts'
import { port } from '../../env.ts'

const link = new OpenAPILink(routerContract, {
  url: `http://127.0.0.1:${port}/openapi`,
  // headers: { Authorization: 'Bearer token' },
})

export const orpc: JsonifiedClient<
  ContractRouterClient<typeof routerContract>
> = createORPCClient(link)
