import json from "./data/training-data.json" with { type: "json" }
import { trainingSessionSchema } from "./schema/training.ts"
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts"

const PORT: number = Number(Deno.env.get('PORT')) || 8000

const router = new Router()
router
  .get("/", (context) => {
    context.response.redirect("/api")
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

await app.listen({ port: PORT })
