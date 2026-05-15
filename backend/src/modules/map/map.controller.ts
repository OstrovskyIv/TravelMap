import { Response, Request } from 'express'
import { query } from '../../shared/db/index.js'
import { AuthRequest } from '../../shared/middleware/auth.middleware.js'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs/promises'

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => { cb(null, 'temp_' + Date.now() + path.extname(file.originalname)) }
})
export const upload = multer({ storage })

export const uploadFile = async (req: any, res: Response) => {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    const fileName = `img_${Date.now()}.webp`;
    const outputPath = path.join('uploads', fileName);
    try {
        await sharp(req.file.path).resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(outputPath);
        await fs.unlink(req.file.path);
        res.json({ url: `http://localhost:5050/uploads/${fileName}` });
    } catch (err) { res.status(500).json({ message: 'Sharp error' }); }
};

export const getCountryLeaderboard = async (_req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT
                country_id as id,
                COUNT(*) as visits,
                COALESCE(AVG((COALESCE(interest,0) + COALESCE(cleanliness,0) + COALESCE(friendliness,0) + COALESCE(difficulty,0)) / 4.0), 0) as value
            FROM unlocked_countries
                LEFT JOIN country_ratings USING (country_id)
            GROUP BY country_id ORDER BY value DESC, visits DESC LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
};

export const getCityLeaderboard = async (_req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT
                city_id as id,
                COUNT(*) as visits,
                COALESCE(AVG((COALESCE(interest,0) + COALESCE(cleanliness,0) + COALESCE(friendliness,0) + COALESCE(infrastructure,0)) / 4.0), 0) as value
            FROM visited_cities
                LEFT JOIN city_ratings USING (city_id)
            GROUP BY city_id ORDER BY value DESC, visits DESC LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
};

export const getChat = async (req: AuthRequest, res: Response) => {
    const { targetId } = req.params;
    try {
        const result = await query(`
            SELECT m.*, m.author_name as author, m.message_text as text, m.created_at as timestamp,
            (SELECT json_build_object('text', r.message_text, 'author', r.author_name) FROM chat_messages r WHERE r.id = m.reply_to_id) as reply_to,
            (SELECT json_agg(json_build_object('emoji', re.emoji, 'count', 1)) FROM chat_reactions re WHERE re.message_id = m.id) as reactions
            FROM chat_messages m
            WHERE m.target_id = $1 AND m.album_id IS NULL
            ORDER BY m.created_at ASC
        `, [targetId]);
        res.json(result.rows.map(r => ({...r, reactions: r.reactions || []})));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching chat' });
    }
};

export const postMessage = async (req: AuthRequest, res: Response) => {
    const { targetId, text, type, media_url, caption, albumId, replyToId } = req.body;
    try {
        const user = await query('SELECT username FROM users WHERE id = $1', [req.userId]);
        await query(
            'INSERT INTO chat_messages (target_id, user_id, author_name, message_text, type, media_url, caption, album_id, reply_to_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [targetId, req.userId, user.rows[0].username, text || '', type || 'text', media_url || null, caption || null, albumId || null, replyToId || null]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: 'Error posting message' }); }
};

export const saveCityRating = async (req: AuthRequest, res: Response) => {
    const { cityId, interest, cleanliness, friendliness, infrastructure } = req.body;
    try {
        await query(`
            INSERT INTO city_ratings (user_id, city_id, interest, cleanliness, friendliness, infrastructure)
            VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id, city_id) 
            DO UPDATE SET interest=EXCLUDED.interest, cleanliness=EXCLUDED.cleanliness, friendliness=EXCLUDED.friendliness, infrastructure=EXCLUDED.infrastructure
        `, [req.userId, cityId, interest || 0, cleanliness || 0, friendliness || 0, infrastructure || 0]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: 'Error saving rating' }); }
};

export const getCityData = async (req: AuthRequest, res: Response) => {
    const { cityId } = req.params;
    try {
        const rating = await query('SELECT * FROM city_ratings WHERE city_id = $1 AND user_id = $2', [cityId, req.userId]);
        const albums = await query(`
            SELECT a.*, (SELECT json_agg(m.*) FROM chat_messages m WHERE m.album_id = a.id) as photos
            FROM city_albums a WHERE a.city_id = $1
        `, [cityId]);
        res.json({ rating: rating.rows[0] || {}, albums: albums.rows || [] });
    } catch (err) { res.status(500).json({ message: 'Error fetching city data' }); }
};

export const createAlbum = async (req: AuthRequest, res: Response) => {
    try {
        const result = await query('INSERT INTO city_albums (city_id, user_id, name) VALUES ($1, $2, $3) RETURNING *', [req.body.cityId, req.userId, req.body.name]);
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ message: 'Error creating album' }); }
};

export const getProgress = async (req: AuthRequest, res: Response) => {
    try {
        const countries = await query('SELECT country_id FROM unlocked_countries WHERE user_id = $1', [req.userId]);
        const cities = await query('SELECT country_id, city_id FROM visited_cities WHERE user_id = $1', [req.userId]);
        const ratings = await query('SELECT country_id, interest, cleanliness, friendliness, difficulty FROM country_ratings WHERE user_id = $1', [req.userId]);
        res.json({ unlockedCountries: countries.rows.map((r: any) => r.country_id), visitedCities: cities.rows, ratings: ratings.rows });
    } catch (err) { res.status(500).json({ message: 'Error' }); }
};
export const unlockCountry = async (req: AuthRequest, res: Response) => { try { await query('INSERT INTO unlocked_countries (user_id, country_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.userId, req.body.countryId]); res.json({ success: true }); } catch (err) { res.status(500).json({ message: 'Error' }); } };
export const toggleCity = async (req: AuthRequest, res: Response) => { try { const exists = await query('SELECT * FROM visited_cities WHERE user_id = $1 AND city_id = $2', [req.userId, req.body.cityId]); if (exists.rows.length > 0) { await query('DELETE FROM visited_cities WHERE user_id = $1 AND city_id = $2', [req.userId, req.body.cityId]); } else { await query('INSERT INTO visited_cities (user_id, country_id, city_id) VALUES ($1, $2, $3)', [req.userId, req.body.countryId, req.body.cityId]); } res.json({ success: true }); } catch (err) { res.status(500).json({ message: 'Error' }); } };
export const saveRating = async (req: AuthRequest, res: Response) => { try { await query(`INSERT INTO country_ratings (user_id, country_id, interest, cleanliness, friendliness, difficulty) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id, country_id) DO UPDATE SET interest=EXCLUDED.interest, cleanliness=EXCLUDED.cleanliness, friendliness=EXCLUDED.friendliness, difficulty=EXCLUDED.difficulty`, [req.userId, req.body.countryId, req.body.interest, req.body.cleanliness, req.body.friendliness, req.body.difficulty]); res.json({ success: true }); } catch (err) { res.status(500).json({ message: 'Error' }); } };
export const addReaction = async (req: AuthRequest, res: Response) => { try { await query('INSERT INTO chat_reactions (message_id, user_id, emoji) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [req.body.messageId, req.userId, req.body.emoji]); res.json({ success: true }); } catch (err) { res.status(500).json({ message: 'Error' }); } };
export const votePoll = async (req: AuthRequest, res: Response) => { try { await query(`INSERT INTO chat_poll_votes (poll_id, user_id, option_index) VALUES ($1, $2, $3) ON CONFLICT (poll_id, user_id) DO UPDATE SET option_index = EXCLUDED.option_index`, [req.body.pollId, req.userId, req.body.optionIndex]); res.json({ success: true }); } catch (err) { res.status(500).json({ message: 'Error' }); } };