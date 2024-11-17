import type { FC } from 'hono/jsx'
import { Hono } from 'hono'

import { hc } from 'hono/client'
import type { app } from '../../app.ts'

const client = hc<typeof app>(
  `http://localhost:8000`,
)

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
    const ascents = (await res.json()).data

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
