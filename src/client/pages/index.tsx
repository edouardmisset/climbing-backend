import type { FC } from 'hono/jsx'
import { Hono } from 'hono'

import { hc } from 'hono/client'
import type { app } from '../../app.ts'
import { load } from '@std/dotenv'
import type { Ascent } from 'schema/ascent.ts'

await load({ export: true })
const env = Deno.env.toObject()
const apiBaseUrl = env.API_BASE_URL

// this is a trick to calculate the type when compiling
const client = hc<typeof app>('')
export type Client = typeof client
export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof app>(...args)

const Layout: FC = (props) => {
  return (
    <html>
      <body>
        <Navbar />

        {props.children}

        <Footer />
      </body>
    </html>
  )
}

const Navbar: FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>Insert</li>
          <li>nav</li>
          <li>here</li>
        </ul>
      </nav>
    </header>
  )
}

const Footer: FC = () => {
  return (
    <footer>
      <p>
        Copyright <b>@edouardmisset</b> 2024-2024
      </p>
    </footer>
  )
}

export const pages = new Hono().get('/', (c) => {
  return c.html(
    <Layout>
      <a href='/ascents'>Ascents</a>
    </Layout>,
  )
})
  .get('/ascents', async (c) => {
    let ascents: Ascent[] | undefined = undefined
    try {
      const res = await hcWithType(apiBaseUrl).api.ascents.$get()
      console.log({ res })

      const json = await res.json()

      // console.log({ json })

      ascents = json.data
    } catch (error) {
      globalThis.console.error(error, c.req.url);

    }
    // console.log({ ascents })

    if(ascents === undefined) {
      return c.html(
        <Layout>
          <h1>Failed to load ascents</h1>
        </Layout>,
      )
    }

    return c.html(
      <Layout>
        <h1>Hello Ascents</h1>
        <ul>
          {ascents.map(({ routeName, crag, topoGrade }) => (
            <li>{routeName} ({crag}) - {topoGrade}</li>
          ))}
        </ul>
      </Layout>,
    )
  })
