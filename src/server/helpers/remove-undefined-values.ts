export function removeObjectExtendedNullishValues<
  T extends Record<string, unknown>,
>(obj: T): T {
  // deno-lint-ignore no-explicit-any
  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value
    }
    return acc
  }, {})
}
