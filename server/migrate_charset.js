const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Jplk@1145',
    database: process.env.DB_NAME || 'km_health_db',
};

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        console.log('Updating database character set...');
        await connection.query(`ALTER DATABASE ${dbConfig.database} CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci`);

        console.log('Fetching tables...');
        const [tables] = await connection.query('SHOW TABLES');
        // The key for the table name is usually "Tables_in_dbname"
        const dbNameKey = Object.keys(tables[0])[0]; // Get the first key dynamically to avoid hardcoding dbname issues if user changed it

        for (const row of tables) {
            const tableName = row[dbNameKey];
            console.log(`Updating table: ${tableName}`);
            await connection.query(`ALTER TABLE ${tableName} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
        }

        console.log('Migration completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
