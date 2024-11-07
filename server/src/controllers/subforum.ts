import { Request, Response } from 'express'

export const getSubforum = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params
  res.json({ message: 'Subforum with id ' + id + ' retrieved successfully' })
}
