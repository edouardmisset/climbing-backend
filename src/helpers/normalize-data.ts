// TODO: Make this function generic and improve its types

export function normalizeData(
  // deno-lint-ignore no-explicit-any
  trainingSessions: any[],
): { headers: string[]; rows: unknown[][] } {
  // Calculate the number of sessions to sample
  const sampleSize = Math.floor(trainingSessions.length * 0.2)

  // Create a set of indices to sample
  const sampleIndices = new Set<number>()

  // Randomly add indices to the set until we have enough
  while (sampleIndices.size < sampleSize) {
    const randomIndex = Math.floor(Math.random() * trainingSessions.length)
    sampleIndices.add(randomIndex)
  }
  sampleIndices.add(0)
  sampleIndices.add(trainingSessions.length - 1)

  // Find the maximum number of keys in the sampled sessions
  let maxUniqueKeys = 0
  for (const index of sampleIndices) {
    const session = trainingSessions[index]
    maxUniqueKeys = Math.max(maxUniqueKeys, Object.keys(session).length)
  }

  // Now proceed as before, but stop searching for keys after maxUniqueKeys
  const headersSet = new Set<string>()
  let uniqueKeys = 0

  for (const session of trainingSessions) {
    for (const key in session) {
      if (!headersSet.has(key)) {
        headersSet.add(key)
        uniqueKeys++
        if (uniqueKeys >= maxUniqueKeys) {
          break
        }
      }
    }
    if (uniqueKeys >= maxUniqueKeys) {
      break
    }
  }

  const headers = Array.from(headersSet)
  const rows: unknown[][] = []

  for (let i = 0; i < trainingSessions.length; i++) {
    rows[i] = headers.map((header) =>
      trainingSessions[i][header as keyof typeof trainingSessions[number]] ?? ''
    )
  }

  return { headers, rows }
}
