const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
            // Save relative path only
            image_url = `/uploads/${req.file.filename}`;
        }
        const [result] = await db.query(
            'INSERT INTO categories (name, image_url) VALUES (?, ?)',
            [name, image_url]
        );
        res.status(201).json({ id: result.insertId, name, image_url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
            // Save relative path only
            image_url = `/uploads/${req.file.filename}`;
        }

        // Check if category exists
        const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const currentCat = existing[0];
        const newName = name || currentCat.name;
        const newImage = image_url !== undefined ? image_url : currentCat.image_url;

        await db.query(
            'UPDATE categories SET name = ?, image_url = ? WHERE id = ?',
            [newName, newImage, id]
        );

        res.json({ id, name: newName, image_url: newImage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
