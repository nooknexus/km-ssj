# KM Health - Server

Backend API พัฒนาด้วย Node.js, Express และ MySQL

## Prerequisites
- Node.js (v16+)
- MySQL Database

## Setup

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```

2. ตั้งค่า Database:
   - สร้าง Database ชื่อ `km_db` (หรือตามที่ตั้งใน .env)
   - Import Schema:
     ```bash
     mysql -u root -p km_db < schema.sql
     mysql -u root -p km_db < migrate_sso.sql
     mysql -u root -p km_db < migrate_add_approval.sql
     ```

3. สร้างไฟล์ `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=km_db
   PORT=5001
   JWT_SECRET=secret
   
   # SSO Config
   HEALTH_CLIENT_ID=...
   HEALTH_CLIENT_SECRET=...
   HEALTH_REDIRECT_URI=http://localhost:5001/api/auth/healthid
   FRONTEND_URL=http://localhost:5173
   ```

## Running

- **Development**: `npm run dev` (Hot reload with nodemon)
- **Production**: `node index.js` (หรือใช้ PM2)

## API Structure

- `/api/auth`: Login, SSO Callback
- `/api/users`: CRUD Users, Approve, Change Role
- `/api/categories`: Manage Categories
- `/api/items`: Manage Articles

## Security Note

- **CORS**: ในโหมด Development จะเปิดกว้าง ใน Production ควรกำหนด `CORS_ORIGIN` ใน `.env`
- **Passwords**: ผู้ใช้ทั่วไปใช้ SSO (ไม่มี Password ในระบบเรา), Admin แบบดั้งเดิมใช้ bcrypt hash
