import { load } from '@std/dotenv'
import { z } from 'zod'
import { FALLBACK_PORT } from './server/constants.ts'

await load({ export: true })

// Raw environment as provided by Deno
const rawEnv = Deno.env.toObject()

// Basic schema. Only enforce strict requirements in production to avoid
// hindering local dev and tests when Google credentials are not set.
const baseEnvSchema = z.object({
  ENV: z.string(),
  PORT: z.string(),

  GOOGLE_SHEET_ID_ASCENTS: z.string(),
  GOOGLE_SHEET_ASCENTS_SHEET_TITLE: z.string(),
  GOOGLE_SHEET_ASCENTS_EDIT_SHEET_TITLE: z.string(),
  GOOGLE_SHEET_ASCENTS_URL_CSV: z.string(),

  GOOGLE_SHEET_ID_TRAINING: z.string(),
  GOOGLE_SHEET_TRAINING_SHEET_TITLE: z.string(),
  GOOGLE_SHEET_TRAINING_EDIT_SHEET_TITLE: z.string(),
  GOOGLE_SHEET_TRAINING_URL_CSV: z.string(),

  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
})

const parsedBase = baseEnvSchema.parse(rawEnv)

// In production, ensure required Google credentials are present
const isProduction = parsedBase.ENV === 'production'
const prodSchema = baseEnvSchema.extend({
  GOOGLE_SHEET_ID_ASCENTS: z.string().min(1),
  GOOGLE_SHEET_ASCENTS_SHEET_TITLE: z.string().min(1),
  GOOGLE_SHEET_ASCENTS_EDIT_SHEET_TITLE: z.string().min(1),
  GOOGLE_SHEET_ASCENTS_URL_CSV: z.string().url(),

  GOOGLE_SHEET_ID_TRAINING: z.string().min(1),
  GOOGLE_SHEET_TRAINING_SHEET_TITLE: z.string().min(1),
  GOOGLE_SHEET_TRAINING_EDIT_SHEET_TITLE: z.string().min(1),
  GOOGLE_SHEET_TRAINING_URL_CSV: z.string().url(),

  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email(),
  GOOGLE_PRIVATE_KEY: z.string().min(1),
})

export const env = isProduction ? prodSchema.parse(rawEnv) : parsedBase

export const PORT = Number(env.PORT) || FALLBACK_PORT
