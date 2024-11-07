import { Request, Response } from 'express'

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  res.json({ message: 'User with id ' + id + ' retrieved successfully' })
}
