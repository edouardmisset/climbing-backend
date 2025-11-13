import * as ascents from './ascents.ts'
import * as areas from './areas.ts'
import * as crags from './crags.ts'
import * as grades from './grades.ts'
import * as training from './training.ts'
import { orpcServer } from '~/server/routes/server.ts'

export const router = orpcServer.router({
  ascents,
  areas,
  crags,
  grades,
  training,
})
