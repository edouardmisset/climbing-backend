import { implement } from '@orpc/server'
import { contract } from 'contracts/contract.ts'

export const orpcServer = implement(contract)
