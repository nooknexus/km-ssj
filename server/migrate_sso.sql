-- Migration: Add SSO columns to users table
-- เพิ่ม columns สำหรับรองรับ Provider ID SSO
-- รันคำสั่งนี้ผ่าน MySQL client หรือ phpMyAdmin

USE km_health_db;

-- เพิ่ม display_name column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) DEFAULT NULL;

-- เพิ่ม provider_profile column (JSON)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS provider_profile JSON DEFAULT NULL;

-- เพิ่ม updated_at column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- อัพเดท password column ให้เป็น empty string ได้ (สำหรับ SSO users ที่ไม่ใช้ password)
ALTER TABLE users 
MODIFY COLUMN password VARCHAR(255) DEFAULT '';

-- แสดงโครงสร้างตารางหลังจากอัพเดท
DESCRIBE users;
