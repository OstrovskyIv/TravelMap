import { Router } from 'express'
import {
    getProgress, unlockCountry, toggleCity, saveRating,
    getChat, postMessage, addReaction, votePoll,
    upload, uploadFile, getCountryLeaderboard, getCityLeaderboard,
    saveCityRating, getCityData, createAlbum
} from './map.controller.js'
import { protect } from '../../shared/middleware/auth.middleware.js'

const router = Router()

router.get('/progress', protect, getProgress)
router.post('/unlock', protect, unlockCountry)
router.post('/city', protect, toggleCity)
router.post('/rating', protect, saveRating)

// Чат и Опросы
router.get('/chat/:targetId', protect, getChat)
router.post('/chat', protect, postMessage)
router.post('/chat/reaction', protect, addReaction)
router.post('/chat/vote', protect, votePoll)

// Города и Лидерборды
router.get('/leaderboard/countries', protect, getCountryLeaderboard)
router.get('/leaderboard/cities', protect, getCityLeaderboard)
router.post('/city/rating', protect, saveCityRating)
router.get('/city/data/:cityId', protect, getCityData)
router.post('/city/album', protect, createAlbum)

// Загрузка
router.post('/upload', protect, upload.single('image'), uploadFile)

export default router