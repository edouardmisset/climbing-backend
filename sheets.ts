import { join } from "https://deno.land/std@0.210.0/path/mod.ts"

import { google } from "npm:googleapis"
import { authenticate } from "npm:@google-cloud/local-auth"

const sheets = google.sheets("v4")

async function runSample(
  spreadsheetId = "161TYeCcN5X4famqN94svQnpWK0ZLhKb1su0lpfsY3TY",
  range = "AllTraining!A1:L1000",
) {
  // Obtain user credentials to use for the request
  const auth = await authenticate({
    keyfilePath: join(Deno.cwd(), "./credentials.json"),
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  })
  google.options({ auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })
  console.log(res.data)
  return res.data
}

if (import.meta.main) {
  runSample().catch(console.error)
}
