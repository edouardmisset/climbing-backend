import { Database, SQLite3Connector } from "denodb"

import { Ascent } from "./models/ascent.ts"

const connector = new SQLite3Connector({
  filepath: "./dev.sqlite",
})

export const db = new Database(connector)

db.link([Ascent])