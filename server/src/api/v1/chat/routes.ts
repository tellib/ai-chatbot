import { Request, Response, Router } from 'express'
import {
  handleCreateChat,
  handleGetChats,
  handleUpdateTitle,
} from './controller'

const router: Router = Router()

router.get('/', handleGetChats)
router.post('/', handleCreateChat)
router.post(
  '/title/:chat_id',
  handleUpdateTitle as (req: Request, res: Response) => void,
)

export const chats: Router = router
