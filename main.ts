import json from "./data/training-data.json" with { type: "json" }
import { trainingSessionSchema } from "./schema/training.ts"
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts"
import { google } from "npm:googleapis"

import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts"

const env = await load()
const PORT = Number(env.PORT) || 8000
const TRAINING_SPREADSHEET_ID = env.TRAINING_SPREADSHEET_ID

const decoder = new TextDecoder("utf-8")
const keys = JSON.parse(
  decoder.decode(Deno.readFileSync("./credentials.json")),
)
const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0],
)

// Generate the url that will be used for authorization
const authorizeUrl = client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
})

// List Majors
const listMajors = (
  auth: any,
) => {
  const sheets = google.sheets("v4")
  sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: TRAINING_SPREADSHEET_ID,
    range: "Sheet1!A1:Z1000",
    // key: GOOGLE_API_KEY,
  }, (err: any, response: any) => {
    if (err) {
      console.log("The API returned an error: " + err)
      return
    }
    const rows = response.data.values
    if (rows.length) {
      console.log("Name, Major:")
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row: any) => {
        console.log(`${row[0]}, ${row[4]}`)
      })
    } else {
      console.log("No data found.")
    }
  })
}

const router = new Router()
router
  .get("/", (context) => {
    context.response.redirect("/api")
  })
  .get("/oauth2callback", (context) => {
    const code = context.request.url.searchParams.get("code")
    if (code === null) {
      throw new Error("Code not found")
    }
    client.getToken(code, (err, tokens) => {
      if (err) {
        console.error("Error getting oAuth tokens:")
        throw err
      }
      if (tokens == null) {
        throw new Error("Tokens not found")
      }
      client.credentials = tokens
      console.log("Authentication successful! Please return to the console.")
      // server.close()
      listMajors(client)
    })
  })
  .get("/api", (context) => {
    context.response.body = "Hello API!"
  })
  .get("/api/training-sessions", (context) => {
    const payload = { data: trainingSessionSchema.array().parse(json.data) }
    context.response.headers.set("Content-Type", "application/json")
    context.response.headers.set("Access-Control-Allow-Origin", "*")
    context.response.body = payload
  })
  .get("/api/ascents", (context) => {
    context.response.body = "Under construction"
  })

const app = new Application()

// Logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.headers.get("X-Response-Time")
  globalThis.console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`)
})

// Timer
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.response.headers.set("X-Response-Time", `${ms}ms`)
})
app.use(router.routes())
app.use(router.allowedMethods())

app.addEventListener("listen", async (_evt) => {
  await fetch(authorizeUrl)
})

await app.listen({ port: PORT })
