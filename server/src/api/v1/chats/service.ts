import { getDb } from '@/config/database'

export async function findChatById(id: string) {
  const prisma = getDb()
  return prisma.chat.findUnique({
    where: { id: parseInt(id) },
  })
}

export async function createChat(user_id: number) {
  const prisma = getDb()
  return prisma.chat.create({
    data: { user_id },
  })
}
