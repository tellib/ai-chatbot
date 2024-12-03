import { requireUser } from '@/middlewares'
import { Router } from 'express'
import { auth } from './auth/routes'
import { chats } from './chat/routes'
import { messages } from './message/routes'

const router: Router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' })
})
router.use('/auth', auth)
router.use('/chat', requireUser, chats)
router.use('/message', requireUser, messages)

export { router }
