import { Router } from 'express'
import { getUser } from './controller'

const router: Router = Router()

router.get('/:id', getUser)

export const users: Router = router
