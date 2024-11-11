import { getSub } from '@/controllers/sub'
import { Router } from 'express'

const router: Router = Router()

router.get('/:id', getSub)

export const subforum: Router = router
