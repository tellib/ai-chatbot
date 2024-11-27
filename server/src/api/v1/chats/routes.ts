import { Router } from 'express'
import { getChat } from './controller'

const router: Router = Router()

// router.post('/login', login)
router.get('/id/:id', getChat)

export const chats: Router = router
