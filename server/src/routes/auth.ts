import { login, signUp } from '@/controllers/auth'
import { Router } from 'express'

const router: Router = Router()

router.post('/login', login)
router.post('/signup', signUp)
// router.get('/logout', () => {})

export const auth: Router = router
