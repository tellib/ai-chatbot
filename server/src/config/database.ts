import { PrismaClient } from '@prisma/client'

// prevents multiple instances during hot reloading in development
declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma
}

export const getDb = () => prisma

export const closeDb = async () => {
  await prisma.$disconnect()
}
