/**
 * Fix Migration: Replace absolute URLs with relative paths in categories table
 * 
 * แก้ไขปัญหา Mixed Content และ PNA Warning โดยการแปลง URL ในฐานข้อมูล
 * จาก: http://localhost:5000/uploads/xxx.png หรือ https://.../uploads/xxx.png
 * เป็น: /uploads/xxx.png
 * 
 * Run: node migrate_fix_image_urls.js
 */

const db = require('./config/db');

async function migrate() {
    console.log('Starting Image URL Fix...');

    try {
        const connection = await db.getConnection();
        console.log('Connected to database.');

        // ดึง categories ทั้งหมดที่มี http ใน image_url
        const [categories] = await connection.query(`
            SELECT id, image_url FROM categories 
            WHERE image_url LIKE 'http%'
        `);

        console.log(`Found ${categories.length} categories with absolute URLs.`);

        for (const cat of categories) {
            let newUrl = cat.image_url;

            // หาตำแหน่งของ /uploads/
            const uploadIndex = newUrl.indexOf('/uploads/');
            if (uploadIndex !== -1) {
                newUrl = newUrl.substring(uploadIndex); // ตัดเอาตั้งแต่ /uploads/ เป็นต้นไป

                await connection.query('UPDATE categories SET image_url = ? WHERE id = ?', [newUrl, cat.id]);
                console.log(`Fixed ID ${cat.id}: ${cat.image_url} -> ${newUrl}`);
            } else {
                console.log(`Skipped ID ${cat.id}: Could not find /uploads/ pattern in ${cat.image_url}`);
            }
        }

        console.log('\n✅ Image URL Fix completed successfully!');
        connection.release();
        process.exit(0);

    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
