const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        // Popular categories (by total views of items in them)
        const [popularCategories] = await db.query(`
            SELECT c.name, SUM(i.views) as total_views 
            FROM categories c 
            JOIN items i ON c.id = i.category_id 
            GROUP BY c.id 
            ORDER BY total_views DESC 
            LIMIT 5
        `);

        // Popular items (All time)
        const [popularItems] = await db.query(`
            SELECT title, views 
            FROM items 
            ORDER BY views DESC 
            LIMIT 5
        `);

        res.json({ popularCategories, popularItems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const [history] = await db.query(`
            SELECT h.accessed_at, i.title, c.name as category_name
            FROM user_history h
            JOIN items i ON h.item_id = i.id
            JOIN categories c ON i.category_id = c.id
            WHERE h.user_id = ?
            ORDER BY h.accessed_at DESC
        `, [user_id]);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
