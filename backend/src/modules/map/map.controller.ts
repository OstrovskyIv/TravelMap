import { Request, Response } from 'express'
import { query } from '../../shared/db/index.js'
import { AuthRequest } from '../../shared/middleware/auth.middleware.js'

export const getProgress = async (req: AuthRequest, res: Response) => {
    try {
        const countries = await query('SELECT country_id FROM unlocked_countries WHERE user_id = $1', [req.userId])
        const cities = await query('SELECT country_id, city_id FROM visited_cities WHERE user_id = $1', [req.userId])
        const ratings = await query('SELECT country_id, interest, cleanliness, friendliness, difficulty FROM country_ratings WHERE user_id = $1', [req.userId])

        res.json({
            unlockedCountries: countries.rows.map(r => r.country_id),
            visitedCities: cities.rows,
            ratings: ratings.rows
        })
    } catch (err) {
        res.status(500).json({ message: 'Error' })
    }
}

export const unlockCountry = async (req: AuthRequest, res: Response) => {
    const { countryId } = req.body
    try {
        await query('INSERT INTO unlocked_countries (user_id, country_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.userId, countryId])
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ message: 'Error' })
    }
}

export const toggleCity = async (req: AuthRequest, res: Response) => {
    const { countryId, cityId } = req.body
    try {
        const exists = await query('SELECT * FROM visited_cities WHERE user_id = $1 AND city_id = $2', [req.userId, cityId])
        if (exists.rows.length > 0) {
            await query('DELETE FROM visited_cities WHERE user_id = $1 AND city_id = $2', [req.userId, cityId])
        } else {
            await query('INSERT INTO visited_cities (user_id, country_id, city_id) VALUES ($1, $2, $3)', [req.userId, countryId, cityId])
        }
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ message: 'Error' })
    }
}

export const saveRating = async (req: AuthRequest, res: Response) => {
    const { countryId, interest, cleanliness, friendliness, difficulty } = req.body
    try {
        await query(`
            INSERT INTO country_ratings (user_id, country_id, interest, cleanliness, friendliness, difficulty)
            VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (user_id, country_id) DO UPDATE SET
                interest = EXCLUDED.interest, cleanliness = EXCLUDED.cleanliness,
                                                         friendliness = EXCLUDED.friendliness, difficulty = EXCLUDED.difficulty
        `, [req.userId, countryId, interest, cleanliness, friendliness, difficulty])
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ message: 'Error' })
    }
}

// НОВЫЕ МЕТОДЫ ДЛЯ ЧАТА
export const getChat = async (req: Request, res: Response) => {
    const { targetId } = req.params
    try {
        const result = await query(`
            SELECT author_name as author, message_text as text, created_at as timestamp 
            FROM chat_messages 
            WHERE target_id = $1 
            ORDER BY created_at ASC
        `, [targetId])
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ message: 'Chat fetch error' })
    }
}

export const postMessage = async (req: AuthRequest, res: Response) => {
    const { targetId, text } = req.body
    try {
        const user = await query('SELECT username FROM users WHERE id = $1', [req.userId])
        const username = user.rows[0].username
        await query('INSERT INTO chat_messages (target_id, author_name, message_text) VALUES ($1, $2, $3)', [targetId, username, text])
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ message: 'Message post error' })
    }
}