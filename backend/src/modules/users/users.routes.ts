import { Router } from 'express'
import { getMe, getLeaderboard, updateUsername, buyVip } from './users.controller.js'
import { protect } from '../../shared/middleware/auth.middleware.js'

const router = Router()

router.get('/me', protect, getMe)
router.get('/leaderboard', protect, getLeaderboard)
router.put('/update-username', protect, updateUsername)
router.post('/buy-vip', protect, buyVip)

export default router