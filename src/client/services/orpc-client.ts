import { createORPCClient } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { contract } from 'contracts/contract.ts'
import { port } from '~/env.ts'

const link = new OpenAPILink(contract, {
  url: `http://127.0.0.1:${port}/openapi`,
})

export const orpc: JsonifiedClient<
  ContractRouterClient<typeof contract>
> = createORPCClient(link)
