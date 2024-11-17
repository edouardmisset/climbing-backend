import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { getAllAscents } from 'services/ascents.ts'

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
    const ascents = await getAllAscents()

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
