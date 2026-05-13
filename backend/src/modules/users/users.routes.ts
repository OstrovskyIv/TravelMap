import { Router } from 'express'
import { getMe, getLeaderboard } from './users.controller.js'
import { protect } from '../../shared/middleware/auth.middleware.js'

const router = Router()

router.get('/me', protect, getMe)
router.get('/leaderboard', protect, getLeaderboard)

export default router