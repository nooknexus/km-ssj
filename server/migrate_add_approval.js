const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_password || 'Jplk@1145',
    database: process.env.DB_NAME || 'km_health_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function migrate() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        // Check if column exists
        const [columns] = await connection.query("SHOW COLUMNS FROM items LIKE 'is_approved'");

        if (columns.length === 0) {
            console.log('Adding is_approved column...');
            // Default to 1 (true) for existing items so they don't disappear
            await connection.query('ALTER TABLE items ADD COLUMN is_approved BOOLEAN DEFAULT FALSE');
            // Update existing items to be approved
            await connection.query('UPDATE items SET is_approved = TRUE');
            console.log('Column added and existing items approved.');
        } else {
            console.log('Column is_approved already exists.');
        }

        connection.release();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
