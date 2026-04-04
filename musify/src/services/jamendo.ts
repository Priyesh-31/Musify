/**
 * Jamendo API Service — Full-length Creative Commons tracks
 * ──────────────────────────────────────────────────────────
 * HOW TO GET A FREE KEY:
 *   1. Go to https://developer.jamendo.com/v3.0
 *   2. Register a free account → create an app
 *   3. Copy your Client ID
 *   4. Paste it below as JAMENDO_CLIENT_ID
 *
 * Jamendo has 600,000+ CC-licensed tracks — legally free to stream.
 * Great for: full songs, non-commercial apps, portfolios.
 */

import type { Track, JamendoTrack } from '@/types'

// ─── PASTE YOUR FREE JAMENDO CLIENT ID HERE ─────────────────
const JAMENDO_CLIENT_ID = 'YOUR_JAMENDO_CLIENT_ID'
// ────────────────────────────────────────────────────────────

const BASE = 'https://api.jamendo.com/v3.0'

function mapJamendo(t: JamendoTrack): Track {
  return {
    id:       t.id,
    title:    t.name,
    artist:   t.artist_name,
    album:    t.album_name,
    art:      t.album_image,
    preview:  t.audio,        // full MP3 stream — NOT just 30s
    duration: t.duration,
    source:   'jamendo',
  }
}

export async function searchJamendo(query: string, limit = 20): Promise<Track[]> {
  if (JAMENDO_CLIENT_ID === 'YOUR_JAMENDO_CLIENT_ID') {
    console.warn('[Musify] Add your Jamendo Client ID in src/services/jamendo.ts')
    return []
  }
  const url = `${BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&include=musicinfo&audioformat=mp32`
  try {
    const res  = await fetch(url)
    const data = await res.json()
    return (data.results || []).map(mapJamendo)
  } catch {
    return []
  }
}
