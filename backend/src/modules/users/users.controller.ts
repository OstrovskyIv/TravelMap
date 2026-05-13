import { Request, Response } from 'express'
import { query } from '../../shared/db/index.js'
import { AuthRequest } from '../../shared/middleware/auth.middleware.js'

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const result = await query('SELECT id, username, balance, is_vip, is_admin, active_emoji, active_hat FROM users WHERE id = $1', [req.userId])
        const inventory = await query('SELECT item_id, item_type FROM user_inventory WHERE user_id = $1', [req.userId])

        res.json({
            user: result.rows[0],
            inventory: inventory.rows
        })
    } catch (err) {
        res.status(500).json({ message: 'Error' })
    }
}

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT 
                u.id, 
                u.username, 
                u.balance, 
                u.active_emoji, 
                u.active_hat,
                (SELECT COUNT(*) FROM unlocked_countries WHERE user_id = u.id) as countries_count
            FROM users u
            ORDER BY countries_count DESC, u.balance DESC
            LIMIT 10
        `)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Leaderboard error' })
    }
}