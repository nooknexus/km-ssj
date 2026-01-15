const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Jplk@1145',
    database: process.env.DB_NAME || 'km_health_db',
};

async function verify() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        console.log('Checking database collation...');
        const [dbStatus] = await connection.query(`
            SELECT default_character_set_name, default_collation_name 
            FROM information_schema.SCHEMATA 
            WHERE schema_name = ?
        `, [dbConfig.database]);
        console.log('Database:', dbStatus[0]);

        console.log('\nChecking table collations...');
        const [tables] = await connection.query(`
            SELECT TABLE_NAME, TABLE_COLLATION 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ?
        `, [dbConfig.database]);

        console.table(tables);

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

verify();
