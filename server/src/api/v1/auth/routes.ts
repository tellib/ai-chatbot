import { Router } from 'express'
import { getSession, login, logout, signUp } from './controller'

const router: Router = Router()

router.post('/login', login)
router.post('/signup', signUp)
router.get('/session', getSession)
router.get('/logout', logout)

export const auth: Router = router
