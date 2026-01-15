const db = require('../config/db');

exports.getAllItems = async (req, res) => {
    try {
        const [items] = await db.query(
            'SELECT items.*, categories.name as category_name FROM items LEFT JOIN categories ON items.category_id = categories.id ORDER BY items.created_at DESC'
        );
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getItemsByCategory = async (req, res) => {
    try {
        // Check if query param 'all' is present (simple switch for now, ideally protected)
        const showAll = req.query.all === 'true';

        const query = showAll
            ? 'SELECT * FROM items WHERE category_id = ? ORDER BY created_at DESC'
            : 'SELECT * FROM items WHERE category_id = ? AND is_approved = TRUE ORDER BY created_at DESC';

        const [items] = await db.query(query, [req.params.categoryId]);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getItemById = async (req, res) => {
    try {
        const [items] = await db.query('SELECT items.*, categories.name as category_name FROM items LEFT JOIN categories ON items.category_id = categories.id WHERE items.id = ? AND items.is_approved = TRUE', [req.params.id]);
        if (items.length === 0) return res.status(404).json({ message: 'Item not found or pending approval' });

        const item = items[0];

        // Fetch attachments
        const [attachments] = await db.query('SELECT * FROM item_attachments WHERE item_id = ?', [req.params.id]);
        item.attachments = attachments;

        // Increment view count
        await db.query('UPDATE items SET views = views + 1 WHERE id = ?', [req.params.id]);

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getHighlights = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items WHERE is_highlight = TRUE AND is_approved = TRUE LIMIT 8');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPopularItems = async (req, res) => {
    try {
        // Fetch top 3 items by views
        const [rows] = await db.query('SELECT * FROM items WHERE is_approved = TRUE ORDER BY views DESC LIMIT 3');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getNewArrivals = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items WHERE is_approved = TRUE ORDER BY created_at DESC LIMIT 4');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createItem = async (req, res) => {
    const { category_id, title, content, is_highlight } = req.body;
    // req.files is array from upload.array
    const files = req.files || [];
    // Use first file as primary attachment for legacy compatibility
    const attachment_url = files.length > 0 ? `/uploads/${files[0].filename}` : null;

    // Determine status: Admin (role) -> Approved immediately. User -> Pending.
    const is_approved = req.user.role === 'admin' ? 1 : 0;

    try {
        const [result] = await db.query(
            'INSERT INTO items (category_id, title, content, is_highlight, attachment_url, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
            [category_id, title, content, is_highlight === 'true' || is_highlight === true, attachment_url, is_approved]
        );
        const newItemId = result.insertId;

        // Insert attachments
        if (files.length > 0) {
            const attachmentQueries = files.map(file => {
                return db.query(
                    'INSERT INTO item_attachments (item_id, file_path, file_type, original_name) VALUES (?, ?, ?, ?)',
                    [newItemId, `/uploads/${file.filename}`, file.mimetype, file.originalname]
                );
            });
            await Promise.all(attachmentQueries);
        }

        res.status(201).json({ id: newItemId, ...req.body, attachment_url, is_approved, file_count: files.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { is_approved, is_highlight } = req.body;

    // Dynamic query building
    let fields = [];
    let values = [];
    if (is_approved !== undefined) { fields.push('is_approved = ?'); values.push(is_approved); }
    if (is_highlight !== undefined) { fields.push('is_highlight = ?'); values.push(is_highlight); }

    if (fields.length === 0) return res.json({ message: 'No changes' });

    values.push(id);

    try {
        await db.query(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
        res.json({ message: 'Item updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM items WHERE id = ?', [id]);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Record history
exports.recordHistory = async (req, res) => {
    const { item_id } = req.body;
    const user_id = req.user.id;
    try {
        await db.query(
            'INSERT INTO user_history (user_id, item_id) VALUES (?, ?)',
            [user_id, item_id]
        );
        // Increment view count
        await db.query('UPDATE items SET views = views + 1 WHERE id = ?', [item_id]);
        res.status(201).json({ message: 'History recorded' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchItems = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);
    try {
        const query = `%${q}%`;
        const [rows] = await db.query(
            'SELECT items.*, categories.name as category_name FROM items JOIN categories ON items.category_id = categories.id WHERE (title LIKE ? OR content LIKE ?) AND is_approved = TRUE ORDER BY created_at DESC',
            [query, query]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
