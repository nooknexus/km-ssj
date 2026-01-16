const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars with fallback
const result = dotenv.config();
if (result.error) {
    const envPath = path.join(__dirname, '../.env.production');
    const prodResult = dotenv.config({ path: envPath });
    if (prodResult.error) {
        // Try checking current directory as well (for when running from server root)
        const localEnvPath = path.join(__dirname, '../.env.production');
        // Actually the previous one went up one level .. which might be correct if config is in server/config/db.js
        // server/config/db.js -> __dirname = server/config
        // server/.env.production -> ../.env.production
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Jplk@1145',
    database: process.env.DB_NAME || 'km_health_db',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
