import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { searchItunes } from '../lib/itunes.js'
import { upsertManyTracks } from '../lib/tracks.js'
import { getOrCreateUser } from '../lib/users.js'

const querySchema = z.object({
  deviceId: z.string().trim().min(8).max(128),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export const recommendationsRouter = Router()

recommendationsRouter.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() })
  }

  const { deviceId, limit = 20 } = parsed.data
  const user = await getOrCreateUser(deviceId)

  const likes = await prisma.userLike.findMany({
    where: { userId: user.id },
    include: { track: true },
    take: 10,
    orderBy: { createdAt: 'desc' },
  })

  const terms = likes
    .map((x: { track: { genre: string | null; artist: string } }) => x.track.genre || x.track.artist || '')
    .filter(Boolean)
    .slice(0, 3)

  const searchTerm = terms.length ? terms.join(' ') : 'top hits'
  const tracks = await searchItunes(searchTerm, limit)
  await upsertManyTracks(tracks)

  return res.json({ seed: searchTerm, tracks })
})
