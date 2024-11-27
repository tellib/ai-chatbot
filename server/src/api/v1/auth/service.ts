import { getDb } from '@/config/database'
import { compare, hash } from 'bcrypt'

export async function findUserByUsername(username: string) {
  const prisma = getDb()
  return prisma.user.findUnique({
    where: { username },
  })
}

export async function createUser(username: string, password: string) {
  const prisma = getDb()
  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  })

  return user
}

export async function verifyUserCredentials(
  username: string,
  password: string,
) {
  const user = await findUserByUsername(username)

  if (!user || !(await compare(password, user.password))) {
    return null
  }

  return user
}
