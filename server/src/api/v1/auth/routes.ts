import { Router } from 'express'
import {
  handleGetSession,
  handleLogin,
  handleLogout,
  handleRegister,
} from './controller'

const router: Router = Router()

router.post('/login', handleLogin)
router.post('/register', handleRegister)
router.get('/session', handleGetSession)
router.get('/logout', handleLogout)

export const auth: Router = router
