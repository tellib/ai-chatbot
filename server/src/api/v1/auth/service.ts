// TODO: rework this entire page (remove password from response, as well as id)
// the token is stored based on these functions

import { getDb } from '@/config/database'
import { compare, hash } from 'bcrypt'

/**
 * Checks if a user with the given username exists
 */
export async function checkExistingUser(username: string): Promise<boolean> {
  const prisma = getDb()

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })

  return !!user
}

/**
 * Creates a new user
 * @param username The user inputted username
 * @param password The user inputted password
 * @returns The created user object
 */
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

/**
 * Verifies user credentials
 * @param username The username of the user
 * @param password The password of the user
 * @returns User object without password and id
 */
export async function verifyUserCredentials(
  username: string,
  password: string,
) {
  const prisma = getDb()
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true, password: true },
  })

  if (!user || !(await compare(password, user.password))) {
    return null
  }

  return user
}
