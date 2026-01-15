# KM Health - Client

Frontend Application พัฒนาด้วย React และ Vite

## Prerequisites
- Node.js (v16+)
- npm

## Quick Start (Development)

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```

2. สร้างไฟล์ `.env` (ดูตัวอย่าง `.env.example` ถ้ามี หรือใช้ค่า default):
   ```env
   VITE_API_URL=http://localhost:5001
   # หรือใช้ IP หากต้องการทดสอบผ่าน LAN
   # VITE_API_URL=http://192.168.x.x:5001
   ```

3. รัน Development Server:
   ```bash
   npm run dev
   ```
   เข้าใช้งานได้ที่ `http://localhost:5173` (หรือ IP ของเครื่อง)

## Building for Production

สำหรับการนำขึ้น Server จริง (เช่น `km.plkhealth.go.th`):

1. สร้าง/แก้ไขไฟล์ `.env.production`:
   ```env
   VITE_API_URL=https://km.plkhealth.go.th
   ```

2. สั่ง Build:
   ```bash
   npm run build
   ```

3. ไฟล์ Output จะอยู่ในโฟลเดอร์ `dist/` นำไป deploy กับ Web Server ได้เลย

## Key Features

- **AuthContext**: จัดการ Login State และ SSO
- **Admin Panel**: จัดการ Users, Categories, Articles (พร้อม Modal Confirm)
- **Responsive Design**: TailwindCSS
