import type { Track } from '../types.js'

interface ItunesResult {
  trackId: number
  trackName: string
  artistName: string
  collectionName?: string
  artworkUrl100?: string
  previewUrl?: string
  trackTimeMillis?: number
  primaryGenreName?: string
}

interface ItunesResponse {
  results: ItunesResult[]
}

const BASE = 'https://itunes.apple.com/search'

function mapTrack(row: ItunesResult): Track {
  return {
    id: String(row.trackId),
    title: row.trackName || 'Unknown title',
    artist: row.artistName || 'Unknown artist',
    album: row.collectionName || '',
    art: (row.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
    preview: row.previewUrl || '',
    duration: Math.round((row.trackTimeMillis || 30000) / 1000),
    genre: row.primaryGenreName || '',
    source: 'itunes',
  }
}

export async function searchItunes(term: string, limit = 20): Promise<Track[]> {
  const safeLimit = Math.max(1, Math.min(limit, 50))
  const url = `${BASE}?term=${encodeURIComponent(term)}&media=music&entity=song&limit=${safeLimit}`
  const res = await fetch(url)
  if (!res.ok) return []

  const json = (await res.json()) as ItunesResponse
  return (json.results || []).filter((x) => x.previewUrl).map(mapTrack)
}
