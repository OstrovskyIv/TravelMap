import { Response } from 'express'
import { query } from '../../shared/db/index.js'
import { AuthRequest } from '../../shared/middleware/auth.middleware.js'

export const purchaseItem = async (req: AuthRequest, res: Response) => {
    const { itemId, itemType, price } = req.body
    try {
        const user = await query('SELECT balance FROM users WHERE id = $1', [req.userId])

        if (user.rows[0].balance < price) {
            return res.status(400).json({ message: 'Insufficient credits' })
        }

        // 1. Списываем баланс
        await query('UPDATE users SET balance = balance - $1 WHERE id = $2', [price, req.userId])

        // 2. Добавляем в инвентарь
        await query('INSERT INTO user_inventory (user_id, item_id, item_type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
            [req.userId, itemId, itemType])

        res.json({ success: true, newBalance: user.rows[0].balance - price })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Purchase failed' })
    }
}

export const equipItem = async (req: AuthRequest, res: Response) => {
    const { itemId, itemType } = req.body
    try {
        let column = ''
        if (itemType === 'hats') column = 'active_hat'
        else if (itemType === 'profile') column = 'active_emoji'
        else return res.status(400).json({ message: 'Invalid type' })

        await query(`UPDATE users SET ${column} = $1 WHERE id = $2`, [itemId, req.userId])
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ message: 'Equip failed' })
    }
}

export const addReward = async (req: AuthRequest, res: Response) => {
    const { amount } = req.body
    try {
        const result = await query('UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance', [amount, req.userId])
        res.json({ balance: result.rows[0].balance })
    } catch (err) {
        res.status(500).json({ message: 'Reward error' })
    }
}