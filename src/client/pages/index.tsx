import type { FC } from 'hono/jsx'
import { Hono } from 'hono'

import { hc } from 'hono/client'
import type { app } from '../../app.ts'
import { load } from '@std/dotenv'

await load({ export: true })

const env = Deno.env.toObject()

const apiBaseUrl = env.API_BASE_URL

console.log(apiBaseUrl)

const client = hc<typeof app>(apiBaseUrl)

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
    const res = await client.api.ascents.$get({ query: {} })
    console.log({ res })

    const json = await res.json()

    console.log({ json })

    const ascents = json.data
    // console.log({ ascents })

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
