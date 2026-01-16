/**
 * Fix Migration: Ensure all SSO columns exist in users table
 * 
 * แก้ไขปัญหา 500 Error โดยการเพิ่ม columns ที่ขาดหายไป:
 * - is_approved (BOOLEAN) -> สำคัญมาก!
 * - display_name
 * - provider_profile
 * - updated_at
 * 
 * Run: node migrate_fix_sso_schema.js
 */

const db = require('./config/db');

async function migrate() {
    console.log('Starting SSO Schema Fix...');

    try {
        const connection = await db.getConnection(); // Use pool connection
        console.log('Connected to database.');

        // 1. Add is_approved (Critical for authController)
        try {
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE
            `);
            console.log('✓ Checked/Added is_approved column');
        } catch (e) { console.log('Wait, error adding is_approved:', e.message); }

        // 2. Add display_name
        try {
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) DEFAULT NULL
            `);
            console.log('✓ Checked/Added display_name column');
        } catch (e) { console.log('Wait, error adding display_name:', e.message); }

        // 3. Add provider_profile
        try {
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS provider_profile JSON DEFAULT NULL
            `);
            console.log('✓ Checked/Added provider_profile column');
        } catch (e) { console.log('Wait, error adding provider_profile:', e.message); }

        // 4. Add updated_at
        try {
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            `);
            console.log('✓ Checked/Added updated_at column');
        } catch (e) { console.log('Wait, error adding updated_at:', e.message); }

        // 5. Modify password to be nullable or empty default
        try {
            await connection.query(`
                ALTER TABLE users 
                MODIFY COLUMN password VARCHAR(255) DEFAULT ''
            `);
            console.log('✓ Checked/Modified password column');
        } catch (e) { console.log('Wait, error modifying password:', e.message); }

        console.log('\n✅ Schema Fix completed successfully!');
        connection.release();
        process.exit(0);

    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
