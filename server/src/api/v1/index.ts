import { requireUser } from '@/middlewares'
import { Router } from 'express'
import { auth } from './auth/routes'
import { chats } from './chat/routes'
import { messages } from './message/routes'
import { users } from './user/routes'

const router: Router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!', username: req.session?.user?.username })
})
router.use('/auth', auth)
router.use('/user', users)
router.use('/chat', requireUser, chats)
router.use('/chat/:chat_id/messages', requireUser, messages)

export { router }
