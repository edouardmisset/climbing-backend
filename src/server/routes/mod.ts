import { Hono } from 'hono'
import { areas } from './areas.ts'
import { ascents } from './ascents.ts'
import { crags } from './crags.ts'
import { training } from './training.ts'

export const api = new Hono()
  .get('/', (c) =>
    c.html(
      `<h1>Hello API!</h1></br>
      <a href="api/ascents" >Ascents</a></br>
      <a href="api/training" >Training</a>`,
    ))
  .route('/areas', areas)
  .route('/ascents', ascents)
  .route('/crags', crags)
  .route('/training', training)
