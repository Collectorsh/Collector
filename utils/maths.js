export function roundToPrecision(num, precision) {
  const mult = Math.pow(10, precision || 0)
  return Math.round((Number(num || 0) + Number.EPSILON) * mult) / mult 
}