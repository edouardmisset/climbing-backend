import { Database } from '@db/sqlite'

const currentPath = import.meta.url

export const db = new Database(new URL('./test.db', currentPath))

// CREATE Ascent Table

// const changes = db.exec(
//   `CREATE TABLE ASCENTS (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     routeName VARCHAR(100) NOT NULL,
//     crag VARCHAR(100) NOT NULL,
//     date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     topoGrade VARCHAR(10) NOT NULL,
//     numberOfTries INTEGER NOT NULL CHECK(numberOfTries > 0)
//   )
//     `)
// console.log(changes)

// INSERT

// const moreChanges = db.exec(`
//   INSERT INTO ASCENTS (routeName, crag, date, topoGrade, numberOfTries)
//   VALUES ('The Nose', 'El Capitan', '2024-08-25 12:00:00', '5.14a', 3);
//   `)

// console.log(moreChanges)

// {
//   using ascents = db.prepare('SELECT * FROM ASCENTS;')
//   const allAscents = ascents.values()
//   console.log(allAscents)
// }

// db.close()
