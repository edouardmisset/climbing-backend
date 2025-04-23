import { create, findById, list, search } from './ascents.ts'

export const contract = {
  ascents: {
    create,
    findById,
    list,
    search,
  },
}
