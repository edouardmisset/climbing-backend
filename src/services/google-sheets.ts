import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { load } from '@std/dotenv'

const env = await load()

const serviceAccountAuth = new JWT({
  email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export const doc = new GoogleSpreadsheet(
  env.GOOGLE_SHEET_ID,
  serviceAccountAuth,
)
