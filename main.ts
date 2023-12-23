import json from './data/training-data.json' with { type: "json" }
import { trainingSessionSchema } from "./schema/training.ts"


const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

function handler(): Response {
  try {
    const parsedData = trainingSessionSchema.array().parse(json.data)
    const payload = JSON.stringify({ data: parsedData })
    console.log("🚀 ~ file: main.ts:15 ~ handler ~ payload:\n", JSON.parse(payload))

    return new Response(payload, { headers })
  } catch (error) {
    console.error("🚀 ~ file: main.ts ~ handler ~ error:", error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}

Deno.serve(handler)