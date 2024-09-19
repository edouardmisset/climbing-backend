import ascentJSON from '@data/ascent-data.json' with { type: 'json' }
import { removeAccents } from '@edouardmisset/utils'
import { Ascent, ascentSchema } from '@schema/ascent.ts'

const parsedAscents = ascentSchema.array().parse(ascentJSON.data)

let preparedCachedAscents: Ascent[] | undefined
let ascentsHash: string | undefined

async function hashValue(object_: unknown): Promise<string> {
  return await crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(JSON.stringify(object_)))
    .then((h) => {
      const hexes = []
      const view = new DataView(h)
      for (let i = 0; i < view.byteLength; i += 4) {
        hexes.push((`00000000${view.getUint32(i).toString(16)}`).slice(-8))
      }
      return hexes.join('')
    })
}

export async function getPreparedCachedAscents(): Promise<Ascent[]> {
  const currentHash = await hashValue(parsedAscents)

  if (currentHash !== ascentsHash) {
    ascentsHash = currentHash
    preparedCachedAscents = parsedAscents.map((
      { routeName, crag, ...rest },
    ) => ({
      routeName: removeAccents(routeName),
      crag: removeAccents(crag),
      ...rest,
    }))
  }

  return preparedCachedAscents ?? []
}
