import { getUser } from '@/controllers/users'
import { Router } from 'express'

const router: Router = Router()

router.get('/:id', getUser)

export const users: Router = router
