import { Request, Response, Router } from 'express'
import {
  handleCreateChat,
  handleGetChat,
  handleGetChats,
  handleGetRecentChats,
  handleUpdateTitle,
} from './controller'

const router: Router = Router()

router.get('/', handleGetChats)
router.post('/', handleCreateChat)
router.get('/recent', handleGetRecentChats)
router.get('/:chat_id', handleGetChat as (req: Request, res: Response) => void)
router.patch(
  '/:chat_id/title',
  handleUpdateTitle as (req: Request, res: Response) => void,
)

export const chats: Router = router
