import { Router } from 'express'
import { auth } from './auth/routes'
import { chats } from './chats/routes'
import { users } from './users/routes'

const router: Router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' })
})
router.use('/auth', auth)
router.use('/users', users)
router.use('/chats', chats)

export { router }
