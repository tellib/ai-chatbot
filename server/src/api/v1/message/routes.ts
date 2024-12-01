import { Request, Response, Router } from 'express'
import {
  handleGetMessages,
  handleGetStream,
  handleNewMessage,
} from './controller'

const router: Router = Router()

router.get('/:chat_id', handleGetMessages)
router.post('/:chat_id', handleNewMessage)
router.get(
  '/stream/:chat_id',
  handleGetStream as (req: Request, res: Response) => void,
)

export const messages: Router = router
