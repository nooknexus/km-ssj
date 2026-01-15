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
        const [columns] = await connection.query("SHOW COLUMNS FROM items LIKE 'attachment_url'");

        if (columns.length === 0) {
            console.log('Adding attachment_url column...');
            await connection.query('ALTER TABLE items ADD COLUMN attachment_url VARCHAR(255) NULL');
            console.log('Column added successfully.');
        } else {
            console.log('Column attachment_url already exists.');
        }

        connection.release();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
