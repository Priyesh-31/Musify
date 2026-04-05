import type { Track } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const DEVICE_ID_KEY = 'musify-device-id'

function getOrCreateDeviceId() {
  const existing = localStorage.getItem(DEVICE_ID_KEY)
  if (existing) return existing

  const next = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).replace(/\s+/g, '')
  localStorage.setItem(DEVICE_ID_KEY, next)
  return next
}

const session = {
  initialized: false,
  initPromise: null as Promise<void> | null,
  deviceId: '',
}

export async function initLibrarySession() {
  if (session.initialized) return
  if (session.initPromise) return session.initPromise

  session.deviceId = getOrCreateDeviceId()
  session.initPromise = fetch(`${API_BASE}/api/library/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId: session.deviceId }),
  })
    .then(() => {
      session.initialized = true
    })
    .catch(() => {
      // Keep UI functional in offline mode; retry next call.
      session.initialized = false
    })
    .finally(() => {
      session.initPromise = null
    })

  return session.initPromise
}

async function withDeviceId(): Promise<string> {
  await initLibrarySession()
  return session.deviceId || getOrCreateDeviceId()
}

export async function fetchLibraryState() {
  const deviceId = await withDeviceId()
  const res = await fetch(`${API_BASE}/api/library?deviceId=${encodeURIComponent(deviceId)}`)
  if (!res.ok) {
    throw new Error('Failed to fetch library state')
  }
  return (await res.json()) as { likes: Track[]; recents: Track[] }
}

export async function persistLike(track: Track) {
  const deviceId = await withDeviceId()
  await fetch(`${API_BASE}/api/library/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, track }),
  })
}

export async function removeLike(trackId: string | number) {
  const deviceId = await withDeviceId()
  await fetch(`${API_BASE}/api/library/likes/${encodeURIComponent(String(trackId))}?deviceId=${encodeURIComponent(deviceId)}`, {
    method: 'DELETE',
  })
}

export async function addRecent(track: Track) {
  const deviceId = await withDeviceId()
  await fetch(`${API_BASE}/api/library/recents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, track }),
  })
}
