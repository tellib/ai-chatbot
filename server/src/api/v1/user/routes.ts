import { Router } from 'express'
import { handleGetUser } from './controller'

const router: Router = Router()

router.get('/:username', handleGetUser)

export const users: Router = router
