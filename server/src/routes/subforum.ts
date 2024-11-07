import { getSubforum } from '@/controllers/subforum'
import { Router } from 'express'

const router: Router = Router()

router.get('/:id', getSubforum)

export const subforum: Router = router
