import { removeAccents } from '@edouardmisset/utils'
import { Ascent } from 'schema/ascent.ts'
import { getAscents } from 'data/ascent-data.ts'

let preparedCachedAscents: Ascent[] | undefined
let ascentsHash: string | undefined

async function hashValue(object_: unknown): Promise<string> {
  return await crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(JSON.stringify(object_)))
    .then((hashBuffer) => {
      const hexes = []
      const view = new DataView(hashBuffer)
      for (let i = 0; i < view.byteLength; i += 4) {
        hexes.push((`00000000${view.getUint32(i).toString(16)}`).slice(-8))
      }
      return hexes.join('')
    }).catch((error) => {
      console.error('Error hashing:', error)
      return ''
    })
}

export async function getPreparedCachedAscents(): Promise<Ascent[]> {
  const ascents = await getAscents()
  const currentHash = await hashValue(ascents)

  if (currentHash !== ascentsHash) {
    ascentsHash = currentHash
    preparedCachedAscents = ascents.map((
      { routeName, crag, ...rest },
    ) => ({
      routeName: removeAccents(routeName),
      crag: removeAccents(crag),
      ...rest,
    }))
  }

  return preparedCachedAscents ?? []
}
