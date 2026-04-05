import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { getOrCreateUser } from '../lib/users.js'
import { upsertTrack } from '../lib/tracks.js'

const deviceSchema = z.object({
  deviceId: z.string().trim().min(8).max(128),
})

const createSchema = z.object({
  deviceId: z.string().trim().min(8).max(128),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(200).optional(),
})

const addTrackSchema = z.object({
  deviceId: z.string().trim().min(8).max(128),
  track: z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string(),
    artist: z.string(),
    album: z.string().optional().default(''),
    art: z.string().optional().default(''),
    preview: z.string().optional().default(''),
    duration: z.number().int().nonnegative(),
    genre: z.string().optional(),
    source: z.string().optional(),
  }),
})

export const playlistsRouter = Router()

playlistsRouter.get('/', async (req, res) => {
  const parsed = deviceSchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() })
  }

  const user = await getOrCreateUser(parsed.data.deviceId)

  const playlists = await prisma.playlist.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      tracks: {
        orderBy: { position: 'asc' },
        include: { track: true },
      },
    },
  })

  return res.json({
    playlists: playlists.map((pl: Record<string, any>) => ({
      id: pl.id,
      name: pl.name,
      description: pl.description,
      tracks: pl.tracks.map((x: { track: unknown } & Record<string, unknown>) => x.track),
      trackCount: pl.tracks.length,
      updatedAt: pl.updatedAt,
    })),
  })
})

playlistsRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() })
  }

  const user = await getOrCreateUser(parsed.data.deviceId)

  const playlist = await prisma.playlist.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      description: parsed.data.description,
    },
  })

  return res.status(201).json({ playlist })
})

playlistsRouter.post('/:playlistId/tracks', async (req, res) => {
  const parsed = addTrackSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() })
  }

  const { playlistId } = req.params
  const user = await getOrCreateUser(parsed.data.deviceId)

  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId: user.id },
    include: { tracks: true },
  })

  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' })
  }

  const savedTrack = await upsertTrack(parsed.data.track)

  const exists = playlist.tracks.find((x: { trackId: string }) => x.trackId === String(savedTrack.id))
  if (exists) {
    return res.json({ ok: true, alreadyExists: true })
  }

  await prisma.playlistTrack.create({
    data: {
      playlistId: playlist.id,
      trackId: String(savedTrack.id),
      position: playlist.tracks.length,
    },
  })

  return res.status(201).json({ ok: true })
})

playlistsRouter.delete('/:playlistId/tracks/:trackId', async (req, res) => {
  const parsed = deviceSchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() })
  }

  const user = await getOrCreateUser(parsed.data.deviceId)
  const { playlistId, trackId } = req.params

  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId: user.id },
  })

  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' })
  }

  await prisma.playlistTrack.deleteMany({
    where: { playlistId, trackId: String(trackId) },
  })

  return res.json({ ok: true })
})
