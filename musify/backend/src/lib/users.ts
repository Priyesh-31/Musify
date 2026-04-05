import { prisma } from '../db.js'

export async function getOrCreateUser(deviceId: string) {
  const cleanDeviceId = deviceId.trim()

  return prisma.user.upsert({
    where: { deviceId: cleanDeviceId },
    update: {},
    create: { deviceId: cleanDeviceId },
  })
}
