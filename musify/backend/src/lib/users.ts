import { prisma } from '../db.js'

export async function getOrCreateUser(deviceId: string) {
  const cleanDeviceId = deviceId.trim()

  try {
    return await prisma.user.upsert({
      where: { deviceId: cleanDeviceId },
      update: {},
      create: { deviceId: cleanDeviceId },
    })
  } catch (error: any) {
    // Handle race condition: if unique constraint fails, just find the existing user
    if (error?.code === 'P2002' || error?.code === 'P2001') {
      const existing = await prisma.user.findUnique({
        where: { deviceId: cleanDeviceId },
      })
      if (existing) return existing
      throw error
    }
    throw error
  }
}
