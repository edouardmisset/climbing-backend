import * as ascents from './ascents_.ts'
import * as areas from './areas_.ts'
import * as crags from './crags_.ts'
import * as grades from './grades_.ts'
import * as training from './training_.ts'
import { orpcServer } from '~/server/routes/server.ts'

export const router = orpcServer.router({
  ascents,
  areas,
  crags,
  grades,
  training,
})
