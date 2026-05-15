import { Request, Response } from 'express'
import { query } from '../../shared/db/index.js'
import { AuthRequest } from '../../shared/middleware/auth.middleware.js'

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const result = await query('SELECT id, username, balance, is_vip, is_admin, active_emoji, active_hat FROM users WHERE id = $1', [req.userId])
        const inventory = await query('SELECT item_id, item_type FROM user_inventory WHERE user_id = $1', [req.userId])
        res.json({ user: result.rows[0], inventory: inventory.rows })
    } catch (err) { res.status(500).json({ message: 'Error' }) }
}

export const updateUsername = async (req: AuthRequest, res: Response) => {
    const { newUsername } = req.body;
    try {
        const check = await query('SELECT id FROM users WHERE username = $1', [newUsername]);
        if (check.rows.length > 0) return res.status(400).json({ message: 'Username taken' });

        await query('UPDATE users SET username = $1 WHERE id = $2', [newUsername, req.userId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: 'Error' }) }
}

export const buyVip = async (req: AuthRequest, res: Response) => {
    const VIP_PRICE = 5000;
    try {
        const user = await query('SELECT balance, is_vip FROM users WHERE id = $1', [req.userId]);
        if (user.rows[0].is_vip) return res.status(400).json({ message: 'Already VIP' });
        if (user.rows[0].balance < VIP_PRICE) return res.status(400).json({ message: 'Not enough credits' });

        await query('UPDATE users SET balance = balance - $1, is_vip = true WHERE id = $2', [VIP_PRICE, req.userId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: 'Error' }) }
}

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT u.id, u.username, u.balance, u.active_emoji, u.active_hat, u.is_vip,
                   (SELECT COUNT(*) FROM unlocked_countries WHERE user_id = u.id) as countries_count
            FROM users u ORDER BY balance DESC LIMIT 10
        `)
        res.json(result.rows)
    } catch (err) { res.status(500).json({ message: 'Error' }) }
}