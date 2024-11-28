import { Request, Response, Router } from 'express'
import { handleGetMessages, handleNewMessage } from './controller'

const router: Router = Router({ mergeParams: true }) // access parent route parameters

router.get('/', handleGetMessages)
router.post('/', handleNewMessage as (req: Request, res: Response) => void)

export const messages: Router = router
