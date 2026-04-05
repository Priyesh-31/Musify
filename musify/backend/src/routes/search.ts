import { Router } from 'express'
import { z } from 'zod'
import { searchItunes } from '../lib/itunes.js'
import { upsertManyTracks } from '../lib/tracks.js'

const querySchema = z.object({
  q: z.string().trim().min(1),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

const chartMap: Record<string, string> = {
  top: 'top hits',
  pop: 'pop hits',
  electronic: 'electronic dance',
  hiphop: 'hip hop hits',
  rock: 'rock hits',
  rnb: 'rnb soul',
  jazz: 'jazz',
  classical: 'classical piano',
  indie: 'indie',
}

const chartSchema = z.object({
  genre: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export const searchRouter = Router()

searchRouter.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query params', details: parsed.error.flatten() })
  }

  const { q, limit = 20 } = parsed.data
  const tracks = await searchItunes(q, limit)
  await upsertManyTracks(tracks)
  return res.json({ query: q, count: tracks.length, tracks })
})

searchRouter.get('/charts', async (req, res) => {
  const parsed = chartSchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query params', details: parsed.error.flatten() })
  }

  const { genre = 'top', limit = 25 } = parsed.data
  const term = chartMap[genre.toLowerCase()] || `${genre} hits`
  const tracks = await searchItunes(term, limit)
  await upsertManyTracks(tracks)

  return res.json({ genre, term, count: tracks.length, tracks })
})
