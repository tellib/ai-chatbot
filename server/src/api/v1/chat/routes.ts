import { Request, Response, Router } from 'express'
import { handleCreateChat, handleGetChats } from './controller'

const router: Router = Router()

router.get('/', handleGetChats)
router.post('/', handleCreateChat as (req: Request, res: Response) => void)
// router.post(
//   '/title/:chat_id',
//   handleUpdateTitle as (req: Request, res: Response) => void,
// )
// router.delete(
//   '/delete/:chat_id',
//   handleDeleteChat as (req: Request, res: Response) => void,
// )

export const chats: Router = router
