import { Request, Response } from 'express'
import { findUserByUsername } from './service'

export const handleGetUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await findUserByUsername(req.params.username)

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
