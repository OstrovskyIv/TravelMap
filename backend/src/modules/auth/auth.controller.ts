import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../../shared/db/index.js'
import crypto from 'crypto'
import dns from 'dns/promises'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

async function isEmailDomainValid(email: string) {
    const domain = email.split('@')[1];
    try {
        const mxRecords = await dns.resolveMx(domain);
        return mxRecords && mxRecords.length > 0;
    } catch (e) {
        return false;
    }
}

export const register = async (req: Request, res: Response) => {
    const { username, password, email } = req.body

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const isValidDomain = await isEmailDomainValid(email);
        if (!isValidDomain) {
            return res.status(400).json({ message: 'Email domain does not exist' });
        }

        const userExists = await query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email])
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Username or Email already taken' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = crypto.randomBytes(32).toString('hex')

        await query(
            'INSERT INTO users (username, password_hash, email, verification_token) VALUES ($1, $2, $3, $4)',
            [username, hashedPassword, email, verificationToken]
        )

        console.log(`[AUTH] User created: ${username}. Sending verification email...`)

        try {
            const mailOptions = {
                from: `"TravelMap Team" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Confirm your Registry Identity',
                html: `
                    <div style="font-family: sans-serif; background: #0c0c0e; color: white; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid #fbbf24;">
                        <h1 style="color: #fbbf24; text-transform: uppercase;">Verification Required</h1>
                        <p style="font-size: 16px; opacity: 0.8;">To access the global atlas, please confirm your node identity:</p>
                        <a href="http://localhost:5050/api/auth/verify/${verificationToken}" 
                           style="display: inline-block; background: #fbbf24; color: black; padding: 15px 30px; border-radius: 10px; font-weight: bold; text-decoration: none; margin: 20px 0;">
                           VERIFY ACCOUNT
                        </a>
                        <p style="font-size: 10px; opacity: 0.3;">Protocol_v4.0 // Sent via Secure Gmail Node</p>
                    </div>
                `
            }

            await transporter.sendMail(mailOptions)
            console.log('[AUTH] Email sent successfully via Gmail to:', email)
        } catch (mailErr) {
            console.error('[AUTH] Gmail Send Error:', mailErr)
        }

        res.status(201).json({
            success: true,
            message: 'Registry entry created. Verify your email to initialize access.'
        })
    } catch (err) {
        console.error('[AUTH] Registration Error:', err)
        res.status(500).json({ message: 'Server error' })
    }
}

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
        const result = await query('SELECT * FROM users WHERE username = $1', [username])
        const user = result.rows[0]

        if (!user) return res.status(400).json({ message: 'Invalid credentials' })
        if (!user.is_verified) return res.status(403).json({ message: 'Account not verified. Check email.' })

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' })

        res.json({
            user: {
                id: user.id, username: user.username, balance: user.balance,
                is_vip: user.is_vip, is_admin: user.is_admin,
                active_emoji: user.active_emoji, active_hat: user.active_hat
            },
            token
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params
    try {
        const result = await query(
            'UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING id',
            [token]
        )
        if (result.rows.length === 0) return res.status(400).send('<h1>Invalid link</h1>')
        res.redirect('http://localhost:5173/?verified=true')
    } catch (err) {
        res.status(500).send('Error')
    }
}