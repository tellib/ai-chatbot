import { getDb } from '@/config/database'

// TODO: complete this
/**
 * Creates a payload for the user
 * @param id The id of the user
 * @returns The payload
 */
export function createPayload(id: number) {
  const prisma = getDb()
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, role: true },
  })
}
