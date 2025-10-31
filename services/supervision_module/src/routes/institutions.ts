import { Router, type IRouter } from 'express'
import * as ctrl from '../controllers/institutions.js'

const router: IRouter = Router()

router.get('/', ctrl.list)
router.get('/:id', ctrl.getById)
router.post('/', ctrl.create)
router.put('/:id', ctrl.update)
router.delete('/:id', ctrl.remove)

export default router
