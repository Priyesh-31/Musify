import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { getOrCreateUser } from '../lib/users.js'
import { normalizeTrack, upsertTrack } from '../lib/tracks.js'

const initSchema = z.object({
  deviceId: z.string().trim().min(8).max(128),
})

const trackSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  artist: z.string(),
  album: z.string().optional().default(''),
  art: z.string().optional().default(''),
  preview: z.string().optional().default(''),
  duration: z.number().int().nonnegative(),
  genre: z.string().optional(),
  source: z.string().optional(),
})

const likeBodySchema = z.object({
  deviceId: z.string().trim().min(8).max(128),
  track: trackSchema,
})

const recentBodySchema = z.object({
  deviceId: z.string().trim().min(8).max(128),
  track: trackSchema,
})

const deviceQuerySchema = z.object({
  deviceId: z.string().trim().min(8).max(128),
  limit: z.coerce.number().int().min(1).max(200).optional(),
})

export const libraryRouter = Router()

libraryRouter.post('/init', async (req, res) => {
  const parsed = initSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() })
  }

  const user = await getOrCreateUser(parsed.data.deviceId)
  return res.json({ userId: user.id, deviceId: user.deviceId })
})

libraryRouter.get('/', async (req, res) => {
  const parsed = deviceQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() })
  }

  const { deviceId, limit = 50 } = parsed.data
  const user = await getOrCreateUser(deviceId)

  const [likes, recents] = await Promise.all([
    prisma.userLike.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { track: true },
      take: limit,
    }),
    prisma.userRecent.findMany({
      where: { userId: user.id },
      orderBy: { playedAt: 'desc' },
      include: { track: true },
      take: limit,
    }),
  ])

  return res.json({
    likes: likes.map((x: { track: unknown } & Record<string, unknown>) => x.track),
    recents: recents.map((x: { track: unknown } & Record<string, unknown>) => x.track),
  })
})

libraryRouter.post('/likes', async (req, res) => {
  const parsed = likeBodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() })
  }

  const { deviceId, track } = parsed.data
  const user = await getOrCreateUser(deviceId)
  const savedTrack = await upsertTrack(track)

  await prisma.userLike.upsert({
    where: {
      userId_trackId: {
        userId: user.id,
        trackId: String(savedTrack.id),
      },
    },
    create: {
      userId: user.id,
      trackId: String(savedTrack.id),
    },
    update: {},
  })

  return res.status(201).json({ ok: true })
})

libraryRouter.delete('/likes/:trackId', async (req, res) => {
  const parsed = deviceQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() })
  }

  const trackId = String(req.params.trackId)
  const user = await getOrCreateUser(parsed.data.deviceId)

  await prisma.userLike.deleteMany({
    where: {
      userId: user.id,
      trackId,
    },
  })

  return res.json({ ok: true })
})

libraryRouter.post('/recents', async (req, res) => {
  const parsed = recentBodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() })
  }

  const { deviceId, track } = parsed.data
  const user = await getOrCreateUser(deviceId)
  const normalized = normalizeTrack(track)
  await upsertTrack(normalized)

  // Keep recent table compact by removing old duplicates for this user/track first.
  await prisma.userRecent.deleteMany({ where: { userId: user.id, trackId: String(normalized.id) } })
  await prisma.userRecent.create({
    data: {
      userId: user.id,
      trackId: String(normalized.id),
    },
  })

  const stale = await prisma.userRecent.findMany({
    where: { userId: user.id },
    orderBy: { playedAt: 'desc' },
    skip: 100,
    select: { id: true },
  })

  if (stale.length) {
    await prisma.userRecent.deleteMany({
      where: { id: { in: stale.map((x: { id: string }) => x.id) } },
    })
  }

  return res.status(201).json({ ok: true })
})
