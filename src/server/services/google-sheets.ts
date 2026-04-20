import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { env } from '~/env.ts'

export const SHEETS_INFO = {
  ascents: {
    id: env.GOOGLE_SHEET_ID_ASCENTS,
    sheetTitle: env.GOOGLE_SHEET_ASCENTS_SHEET_TITLE,
    editSheetTitle: env.GOOGLE_SHEET_ASCENTS_EDIT_SHEET_TITLE,
    csvExportURL: env.GOOGLE_SHEET_ASCENTS_URL_CSV,
  },
  training: {
    id: env.GOOGLE_SHEET_ID_TRAINING,
    sheetTitle: env.GOOGLE_SHEET_TRAINING_SHEET_TITLE,
    editSheetTitle: env.GOOGLE_SHEET_TRAINING_EDIT_SHEET_TITLE,
    csvExportURL: env.GOOGLE_SHEET_TRAINING_URL_CSV,
  },
} as const

function getServiceAccountAuth(): JWT {
  const serviceAccountEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawPrivateKey = env.GOOGLE_PRIVATE_KEY

  if (!serviceAccountEmail || !rawPrivateKey) {
    throw new Error(
      'Google Service Account credentials are missing. Ensure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY are set.',
    )
  }

  const normalizedPrivateKey = rawPrivateKey.split(String.raw`\n`).join('\n')

  return new JWT({
    email: serviceAccountEmail,
    key: normalizedPrivateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export async function loadWorksheet(
  climbingDataType: keyof typeof SHEETS_INFO,
  options?: { edit?: boolean },
): Promise<GoogleSpreadsheetWorksheet> {
  const { id, sheetTitle, editSheetTitle } = SHEETS_INFO[climbingDataType]
  const { edit = false } = options ?? {}

  if (!id) {
    throw new Error(`Google Sheet id for ${climbingDataType} is missing.`)
  }
  if (!sheetTitle) {
    throw new Error(`Google Sheet title for ${climbingDataType} is missing.`)
  }
  if (edit && !editSheetTitle) {
    throw new Error(
      `Google edit sheet title for ${climbingDataType} is missing.`,
    )
  }

  const sheet = new GoogleSpreadsheet(id, getServiceAccountAuth())
  await sheet.loadInfo()

  const title = edit ? editSheetTitle : sheetTitle
  const worksheet = sheet.sheetsByTitle[title]

  if (!worksheet) {
    throw new Error(`Sheet "${title}" not found`)
  }

  return worksheet
}
