/**
 * Migration: Add SSO columns to users table
 * 
 * เพิ่ม columns สำหรับรองรับ Provider ID SSO:
 * - display_name: ชื่อแสดงจาก Provider ID
 * - provider_profile: JSON data จาก Provider ID
 * - updated_at: timestamp สำหรับการอัพเดท
 * 
 * Run: node migrate_add_sso_columns.js
 */

const db = require('./config/db');

async function migrate() {
    console.log('Starting SSO columns migration...');

    try {
        // เพิ่ม display_name column
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) DEFAULT NULL
        `).catch(err => {
            if (!err.message.includes('Duplicate column')) throw err;
            console.log('Column display_name already exists, skipping...');
        });
        console.log('✓ Added display_name column');

        // เพิ่ม provider_profile column (JSON)
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS provider_profile JSON DEFAULT NULL
        `).catch(err => {
            if (!err.message.includes('Duplicate column')) throw err;
            console.log('Column provider_profile already exists, skipping...');
        });
        console.log('✓ Added provider_profile column');

        // เพิ่ม updated_at column
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `).catch(err => {
            if (!err.message.includes('Duplicate column')) throw err;
            console.log('Column updated_at already exists, skipping...');
        });
        console.log('✓ Added updated_at column');

        // อัพเดท password column ให้เป็น NULL ได้ (สำหรับ SSO users)
        await db.query(`
            ALTER TABLE users 
            MODIFY COLUMN password VARCHAR(255) DEFAULT ''
        `);
        console.log('✓ Modified password column to allow empty (for SSO users)');

        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
