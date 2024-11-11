import { clearSession, getSession } from '@/controllers/session'
import { Router } from 'express'

const router: Router = Router()

router.get('/', getSession)
router.get('/clear', clearSession)

export const session: Router = router
