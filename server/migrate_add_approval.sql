-- Migration: Add is_approved column to users table
-- เพิ่ม column สำหรับระบบ approval

USE km_db;

-- เพิ่ม is_approved column (default false สำหรับ user ใหม่)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- อัพเดท users ที่มีอยู่แล้วให้เป็น approved
UPDATE users SET is_approved = TRUE WHERE is_approved IS NULL OR is_approved = FALSE;

-- แสดงโครงสร้างตารางหลังจากอัพเดท
DESCRIBE users;
