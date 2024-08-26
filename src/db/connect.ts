import { Database } from '@db/sqlite'

const currentPath = import.meta.url

const db = new Database(new URL("./test.db", currentPath))

// deno-lint-ignore no-non-null-assertion
const [version] = db.prepare('select sqlite_version()').value<[string]>()!
console.log(version)

db.close()
