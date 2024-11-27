import { Request, Response } from 'express'
import { findUserById } from './service'

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const user = await findUserById(id)

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
