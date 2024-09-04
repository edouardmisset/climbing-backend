import { PrismaClient, Prisma } from '../generated/client/deno/edge.ts'
import jsonAscent from "@data/ascent-data.json" with { type: 'json'}
import { convertStringDate, datification } from '@edouardmisset/utils'

const prisma = new PrismaClient()


// Transform
const ascentData: Prisma.ascentsCreateInput[] = jsonAscent.data.map((ascent) => ({
  ...ascent,
  routeName: String(ascent.routeName),
  myGrade: ascent?.myGrade ?? ascent.topoGrade,
  date: datification(convertStringDate(`${ascent.date} 12:00`)).toISOString(),
  tries: Number(ascent.tries.replace(' go', '').replace(' Onsight', '').replace(' Flash', '')),
  rating: Number(ascent.rating.replace('*', '')),
  area: String(ascent?.area ?? ''),
  comments: String(ascent?.comments ?? ''),
  height: Number(ascent.height?.replace('m', '') ?? 0)
})
)

/**
 * Seed the database.
 */

const createdAscents = await prisma.ascents.createMany({
  data: ascentData,
})

console.log(`Seeding finished. ${createdAscents.count} Ascents.`)

await prisma.$disconnect()
