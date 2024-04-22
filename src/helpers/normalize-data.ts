export function normalizeData(
  // deno-lint-ignore no-explicit-any
  trainingSessions: any[],
): { headers: string[]; rows: unknown[][] } {
  const headers = Array.from(
    trainingSessions.reduce((acc, session) => {
      for (const key of Object.keys(session)) {
        acc.add(key)
      }
      return acc
    }, new Set()),
  ) as string[]

  const rows = trainingSessions.map((session) =>
    headers.map((header) => session[header as keyof typeof session] ?? '')
  )

  return { headers, rows }
}
