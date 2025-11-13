# Environment Variables

This file documents the environment variables consumed by the application.

> In development, most variables may be undefined except `PORT` and optional
> `ENV`. In production all Google sheet credentials must be present.

## Core

| Variable | Required (prod)   | Description                                                                                     |
| -------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| `ENV`    | Yes               | Environment indicator (`dev`, `production`, etc.). Influences middleware (timing, compression). |
| `PORT`   | No (default 8000) | Port for the HTTP server.                                                                       |

## Google Sheets (Ascents)

| Variable                                | Required (prod) | Description                                                   |
| --------------------------------------- | --------------- | ------------------------------------------------------------- |
| `GOOGLE_SHEET_ID_ASCENTS`               | Yes             | Spreadsheet ID for ascents data.                              |
| `GOOGLE_SHEET_ASCENTS_SHEET_TITLE`      | Yes             | Title of read-only ascents worksheet.                         |
| `GOOGLE_SHEET_ASCENTS_EDIT_SHEET_TITLE` | Yes             | Title of editable ascents worksheet used when inserting rows. |
| `GOOGLE_SHEET_ASCENTS_URL_CSV`          | Yes             | Public CSV export URL (if used for faster bulk retrieval).    |

## Google Sheets (Training)

| Variable                                 | Required (prod) | Description                            |
| ---------------------------------------- | --------------- | -------------------------------------- |
| `GOOGLE_SHEET_ID_TRAINING`               | Yes             | Spreadsheet ID for training data.      |
| `GOOGLE_SHEET_TRAINING_SHEET_TITLE`      | Yes             | Title of read-only training worksheet. |
| `GOOGLE_SHEET_TRAINING_EDIT_SHEET_TITLE` | Yes             | Title of editable training worksheet.  |
| `GOOGLE_SHEET_TRAINING_URL_CSV`          | Yes             | CSV export URL for training data.      |

## Service Account

| Variable                       | Required (prod) | Description                                                            |
| ------------------------------ | --------------- | ---------------------------------------------------------------------- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes             | Service account email with Sheets access.                              |
| `GOOGLE_PRIVATE_KEY`           | Yes             | Private key (use literal newlines or escaped `\n`; loader normalizes). |

## Notes

- In production, absence of any required Google variable causes a startup
  validation error.
- Private key normalization: escaped `\n` sequences are converted to real
  newlines.
- Add secrets via a `.env` file or deployment platform secret manager.
