/**
 * iTunes Search API Service
 * ─────────────────────────
 * Zero config — no API key needed.
 * Returns 30-second preview MP3s legally from Apple's CDN.
 *
 * Docs: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
 */

import type { Track, ItunesResponse, ItunesResult } from '@/types'

const BASE = 'https://itunes.apple.com/search'
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

function mapResult(r: ItunesResult): Track {
  return {
    id:       r.trackId,
    title:    r.trackName   || 'Unknown Title',
    artist:   r.artistName  || 'Unknown Artist',
    album:    r.collectionName || '',
    art:      (r.artworkUrl100 || '').replace('100x100bb', '400x400bb'),
    preview:  r.previewUrl  || '',
    duration: Math.round((r.trackTimeMillis || 30000) / 1000),
    genre:    r.primaryGenreName || '',
    source:   'itunes',
  }
}

/**
 * Search iTunes for songs matching a free-text query.
 * @param term  — any artist, song, album or genre phrase
 * @param limit — max results (1-200, default 20)
 */
export async function searchItunes(term: string, limit = 20): Promise<Track[]> {
  const backendUrl = `${API_BASE}/api/search?q=${encodeURIComponent(term)}&limit=${limit}`
  try {
    const backendRes = await fetch(backendUrl)
    if (backendRes.ok) {
      const payload = await backendRes.json() as { tracks?: Track[] }
      return payload.tracks || []
    }
  } catch {
    // Fall back to direct iTunes call for local-only development.
  }

  const itunesUrl = `${BASE}?term=${encodeURIComponent(term)}&media=music&entity=song&limit=${limit}`
  try {
    const res = await fetch(itunesUrl)
    const data: ItunesResponse = await res.json()
    return (data.results || [])
      .filter(r => r.previewUrl)
      .map(mapResult)
  } catch {
    return []
  }
}

/** Convenience: search a genre by keyword */
export const searchGenre = (genre: string, limit = 20) =>
  searchItunes(genre + ' hits', limit)

/** Preset genre lookups used across the app */
export const GENRE_QUERIES: Record<string, string> = {
  top:        'top hits 2024',
  pop:        'pop hits',
  electronic: 'electronic dance',
  hiphop:     'hip hop hits',
  rock:       'rock hits',
  rnb:        'rnb soul',
  jazz:       'jazz',
  classical:  'classical piano',
  indie:      'indie alternative',
  new:        'new music 2024',
}
