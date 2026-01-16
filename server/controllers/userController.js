const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, email, department, role, display_name, is_approved, created_at FROM users ORDER BY is_approved ASC, created_at DESC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { username, password, email, department, role } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (username, password, email, department, role, is_approved) VALUES (?, ?, ?, ?, ?, TRUE)',
            [username, encryptedPassword, email, department, role || 'user']
        );
        res.status(201).json({ id: result.insertId, username, email, role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: 'Password is required' });

        const encryptedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [encryptedPassword, req.params.id]);

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ message: 'User role updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserApproval = async (req, res) => {
    try {
        const { is_approved } = req.body;
        if (typeof is_approved !== 'boolean') {
            return res.status(400).json({ message: 'is_approved must be a boolean' });
        }

        await db.query('UPDATE users SET is_approved = ? WHERE id = ?', [is_approved, req.params.id]);
        res.json({ message: is_approved ? 'User approved successfully' : 'User approval revoked' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Check approval status (Public - no auth required for pending users)
exports.checkApprovalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await db.query(
            'SELECT id, username, email, role, department, display_name, is_approved FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        if (user.is_approved) {
            // Generate JWT token for approved user
            const jwt = require('jsonwebtoken');
            const token = jwt.sign(
                { user_id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET || 'secret_key',
                { expiresIn: '8h' }
            );

            res.json({
                is_approved: true,
                user: { ...user, token }
            });
        } else {
            res.json({
                is_approved: false,
                user: null
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

