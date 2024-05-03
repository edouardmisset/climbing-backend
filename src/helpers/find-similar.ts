import { removeAccents } from '@edouardmisset/utils'

export function findSimilar(items: string[]): { [key: string]: string[] }[] {
  const map = new Map<string, string[]>()

  for (const item of items) {
    const transformedItem = removeAccents(item).toLowerCase().trim()
    const existingItems = map.get(transformedItem)
    if (!existingItems) {
      map.set(transformedItem, [item])
      continue
    }
    if (!existingItems.includes(item)) {
      existingItems.push(item)
    }
  }

  return Array.from(map.entries())
    .filter(([, values]) => values.length > 1)
    .map(([key, values]) => ({ [key]: values }))
}
