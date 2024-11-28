import { getDb } from '@/config/database'

export async function findUserByUsername(username: string) {
  const prisma = getDb()
  return prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
      created_at: true,
    },
  })
}
