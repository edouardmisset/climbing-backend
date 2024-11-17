import { Hono } from 'hono'
import { areas } from 'routes/areas.ts'
import { createAscentRoute } from 'routes/ascents.ts'
import { crags } from 'routes/crags.ts'
import { training } from 'routes/training.ts'
import { grades } from 'routes/grades.ts'

export const api = new Hono()
  .get('/', (c) =>
    c.html(
      `<h1>Hello API!</h1></br>
      <a href="api/ascents" >Ascents</a></br>
      <a href="api/training" >Training</a>`,
    ))
  .route('/areas', areas)
  .route('/ascents', createAscentRoute())
  .route('/crags', crags)
  .route('/training', training)
  .route('/grades', grades)
