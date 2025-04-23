import { load } from '@std/dotenv'

await load({ export: true })
export const env = Deno.env.toObject()
const FALLBACK_PORT = 8000

export const port = Number(env.PORT) || FALLBACK_PORT
