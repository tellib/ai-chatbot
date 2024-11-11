import { findUserById } from '@/database/users'
import { User } from '@/types/express'
import { Request, Response } from 'express'

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const user = await findUserById(id)

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
      } as User,
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
