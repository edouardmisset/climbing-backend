import { load } from '@std/dotenv'
import { z } from 'zod'
import { FALLBACK_PORT } from './server/constants.ts'

await load({ export: true })

// Raw environment as provided by Deno
const rawEnv = Deno.env.toObject()

// Basic schema. Only enforce strict requirements in production to avoid
// hindering local dev and tests when Google credentials are not set.
const baseEnvSchema = z.object({
  ENV: z.string().optional(),
  PORT: z.string().optional(),

  GOOGLE_SHEET_ID_ASCENTS: z.string().optional(),
  GOOGLE_SHEET_ASCENTS_SHEET_TITLE: z.string().optional(),
  GOOGLE_SHEET_ASCENTS_EDIT_SHEET_TITLE: z.string().optional(),
  GOOGLE_SHEET_ASCENTS_URL_CSV: z.string().optional(),

  GOOGLE_SHEET_ID_TRAINING: z.string().optional(),
  GOOGLE_SHEET_TRAINING_SHEET_TITLE: z.string().optional(),
  GOOGLE_SHEET_TRAINING_EDIT_SHEET_TITLE: z.string().optional(),
  GOOGLE_SHEET_TRAINING_URL_CSV: z.string().optional(),

  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
})

const parsedBase = baseEnvSchema.parse(rawEnv)

// In production, ensure required Google credentials are present
const isProduction = parsedBase.ENV === 'production'
if (isProduction) {
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
  // Will throw with a descriptive zod error in production if missing
  prodSchema.parse(rawEnv)
}

export const env = parsedBase

export const port = Number(env.PORT) || FALLBACK_PORT
