import { removeAccents } from '@edouardmisset/utils'

function formatString(item: string): string {
  const synonyms: Record<string, string> = {
    '(l1 + l2)': 'l1 + l2',
    'l1+l2': 'l1 + l2',
    '(p1 + p2)': 'l1 + l2',
    'p1+p2': 'l1 + l2',
    '(gauche)': 'gauche',
    '(droite)': 'droite',
    '(left)': 'gauche',
    '(right)': 'droite',
  }

  return removeAccents(item)
    .toLowerCase()
    .trim()
    .replaceAll('-', ' ')
    .replace(/[^a-z0-9\s]/gi, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .split(' ') // Split the string into words
    .map((word) => synonyms[word] ?? word) // Replace synonyms
    .join(' ') // Join the words back into a string
}

export function findSimilar(items: string[]): { [key: string]: string[] }[] {
  const map = new Map<string, string[]>()

  for (const item of items) {
    const transformedItem = formatString(item)

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
