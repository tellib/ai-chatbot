import { getSession } from '@/controllers/session'
import { Router } from 'express'

const router: Router = Router()

router.get('/', getSession)

export const session: Router = router
