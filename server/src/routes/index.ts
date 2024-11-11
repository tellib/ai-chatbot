import { authMiddleware } from '@/middlewares/authMiddleware'
import { auth } from '@/routes/auth'
import { session } from '@/routes/session'
// import { sub } from '@/routes/sub'
import { users } from '@/routes/users'
import { Router } from 'express'

const router: Router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' })
})
router.use('/auth', auth)
router.use('/session', authMiddleware, session)
// router.use('/sub', sub)
router.use('/users', users)

export default router
