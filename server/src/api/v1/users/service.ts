import { getDb } from '@/config/database'

export async function findUserById(id: string) {
  const prisma = getDb()
  return prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  })
}
