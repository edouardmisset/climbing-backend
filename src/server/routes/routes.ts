import { create, findById, list, search } from './ascents_.ts'
import { orpcServer } from '~/server/routes/server.ts'

export const router = orpcServer.router({
  ascents: {
    list,
    search,
    findById,
    create,
  },
})
