import type { Track } from '../types.js'
import { prisma } from '../db.js'

export function normalizeTrack(track: Track): Track {
  return {
    id: String(track.id),
    title: track.title || 'Unknown title',
    artist: track.artist || 'Unknown artist',
    album: track.album || '',
    art: track.art || '',
    preview: track.preview || '',
    duration: Number(track.duration || 0),
    genre: track.genre || '',
    source: track.source || 'custom',
  }
}

export async function upsertTrack(track: Track): Promise<Track> {
  const safe = normalizeTrack(track)

  await prisma.trackCache.upsert({
    where: { id: String(safe.id) },
    update: {
      title: safe.title,
      artist: safe.artist,
      album: safe.album,
      art: safe.art,
      preview: safe.preview,
      duration: safe.duration,
      genre: safe.genre,
      source: safe.source || 'custom',
    },
    create: {
      id: String(safe.id),
      title: safe.title,
      artist: safe.artist,
      album: safe.album,
      art: safe.art,
      preview: safe.preview,
      duration: safe.duration,
      genre: safe.genre,
      source: safe.source || 'custom',
    },
  })

  return safe
}

export async function upsertManyTracks(tracks: Track[]): Promise<Track[]> {
  return Promise.all(tracks.map((t) => upsertTrack(t)))
}
