const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'km_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function migrate() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        // Check if column exists in users table
        const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'is_approved'");

        if (columns.length === 0) {
            console.log('Adding is_approved column to users...');
            // Default to FALSE for new users, they need admin approval
            await connection.query('ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE');
            // Update existing users to be approved
            await connection.query('UPDATE users SET is_approved = TRUE');
            console.log('✓ Column added and existing users approved.');
        } else {
            console.log('✓ Column is_approved already exists in users table.');
            // Make sure existing users are approved
            await connection.query('UPDATE users SET is_approved = TRUE WHERE is_approved IS NULL');
            console.log('✓ Existing users without approval status updated.');
        }

        connection.release();
        console.log('\n✅ User approval migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
