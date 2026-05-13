import { Router } from 'express'
import { getProgress, unlockCountry, toggleCity, saveRating } from './map.controller.js'
import { protect } from '../../shared/middleware/auth.middleware.js'

const router = Router()

router.get('/progress', protect, getProgress)
router.post('/unlock', protect, unlockCountry)
router.post('/city', protect, toggleCity)
router.post('/rating', protect, saveRating)

export default router