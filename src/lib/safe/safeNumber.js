export function safeNumber(value) {
  const n = Number(value)
  return isNaN(n) ? 0 : n
}