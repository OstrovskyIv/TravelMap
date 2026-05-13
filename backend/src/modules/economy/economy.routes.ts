import { Router } from 'express'
import { purchaseItem, addReward, equipItem } from './economy.controller.js'
import { protect } from '../../shared/middleware/auth.middleware.js'

const router = Router()

router.post('/buy', protect, purchaseItem)
router.post('/reward', protect, addReward)
router.post('/equip', protect, equipItem)

export default router