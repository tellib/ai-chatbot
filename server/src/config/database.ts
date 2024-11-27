import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDb = () => prisma

export const closeDb = async () => {
  await prisma.$disconnect()
}
