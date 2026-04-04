/** Format seconds → "m:ss" */
export function fmtTime(s: number): string {
  const secs = Math.floor(s || 0)
  const m = Math.floor(secs / 60)
  const r = secs % 60
  return `${m}:${r < 10 ? '0' : ''}${r}`
}

/** Truncate string */
export function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}

/** Clamp number between min and max */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
