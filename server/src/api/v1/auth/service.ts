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
 * @throws Error if the user creation fails
 */
export async function createUser(username: string, password: string) {
  const hashedPassword = await hash(password, 10)

  const prisma = getDb()
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      created_at: true,
      role: true,
    },
  })

  if (!user) {
    throw new Error('Failed to create user')
  }

  return user
}

/**
 * Verifies user credentials
 * @param username The username of the user
 * @param password The password of the user
 * @returns User object without password and id
 * @throws Error if the username does not exist or the password is incorrect
 */
export async function verifyUserCredentials(
  username: string,
  password: string,
) {
  const prisma = getDb()
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    throw new Error('Username does not exist')
  }

  if (!(await compare(password, user.password))) {
    throw new Error('Password is incorrect')
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
