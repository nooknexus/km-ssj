const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Jplk@1145',
    database: process.env.DB_NAME || 'km_health_db'
};

const migrate = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS item_attachments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_id INT NOT NULL,
                file_path VARCHAR(512) NOT NULL,
                file_type VARCHAR(100),
                original_name VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
            )
        `);
        console.log('Table item_attachments created successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        if (connection) await connection.end();
    }
};

migrate();
