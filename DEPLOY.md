# Deployment Guide

คู่มือการ Deploy ระบบ KM Health ขึ้น Server จริง (Ubuntu/Linux) และการใช้งานในวงแลน (Local Network)

## 📌 Server Requirements
- **OS**: Ubuntu 20.04/22.04 LTS หรือ Linux server อื่นๆ
- **Runtime**: Node.js v16+ (แนะนำ v18 LTS)
- **Database**: MySQL หรือ MariaDB
- **Web Server**: Nginx (Reverse Proxy)
- **Process Manager**: PM2

---

## 1. Environment Setup (Production)

### 👉 Frontend (`/client`)
สำหรับ Production เราจะใช้ไฟล์ `.env.production` เมื่อสั่ง Build

1. **สร้างไฟล์ `.env.production`** ในโฟลเดอร์ `client/` (ถ้ายังไม่มี):
   ```env
   # ชี้ไปที่ Domain จริง
   VITE_API_URL=https://km.plkhealth.go.th
   
   # SSO Config (Client ID ต้องลงทะเบียน Redirect URI เป็น https://km.plkhealth.go.th/api/auth/healthid)
   HEALTH_CLIENT_ID=<YOUR_PRODUCTION_CLIENT_ID>
   HEALTH_REDIRECT_URI=https://km.plkhealth.go.th/api/auth/healthid
   
   PROVIDER_CLIENT_ID=<YOUR_PRODUCTION_PROVIDER_ID>
   ```

2. **Build Project**:
   ```bash
   cd client
   npm install
   npm run build
   ```
   *จะได้โฟลเดอร์ `dist` สำหรับนำไปวางใน Web Server*

### 👉 Backend (`/server`)
1. **สร้างไฟล์ `.env`** ในโฟลเดอร์ `server/` (ดูตัวอย่างจาก `.env.production.example`):
   ```env
   # Database
   DB_HOST=localhost
   DB_USER=km_user
   DB_PASSWORD=secure_password
   DB_NAME=km_health_db

   # Server Config
   PORT=5001
   
   # Security
   JWT_SECRET=<RANDOM_STRONG_SECRET>
   CORS_ORIGIN=https://km.plkhealth.go.th
   
   # SSO & Redirects
   HEALTH_CLIENT_ID=<YOUR_PRODUCTION_CLIENT_ID>
   HEALTH_CLIENT_SECRET=<YOUR_PRODUCTION_CLIENT_SECRET>
   HEALTH_REDIRECT_URI=https://km.plkhealth.go.th/api/auth/healthid
   FRONTEND_URL=https://km.plkhealth.go.th
   ```

2. **Start Server with PM2**:
   ```bash
   cd server
   npm install --production
   npm install -g pm2
   pm2 start index.js --name "km-backend"
   pm2 save
   pm2 startup
   ```

---

## 2. Nginx Configuration (Recommended)

ตั้งค่า Nginx ให้ทำหน้าที่เป็น Web Server สำหรับ Frontend และ Reverse Proxy สำหรับ Backend API

ไฟล์ config: `/etc/nginx/sites-available/km-health`

```nginx
server {
    listen 80;
    server_name km.plkhealth.go.th;

    # Frontend (Serve Static Files)
    root /var/www/km-health/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Forward IP Address (สำคัญสำหรับ logs หรือ rate limit)
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 3. Database Migration

บน Server ต้องทำการ Import Database Schema ทั้งหมด:

```bash
mysql -u root -p km_health_db < server/schema.sql
# ถ้ามีไฟล์ migrate อื่นๆ ให้รันตามลำดับ:
mysql -u root -p km_health_db < server/migrate_sso.sql
mysql -u root -p km_health_db < server/migrate_add_approval.sql
```

**Admin คนแรก:**
เมื่อ Login ด้วย SSO ครั้งแรก สถานะจะเป็น `User` และ `Pending` ให้แก้ใน Database โดยตรง:
```sql
UPDATE users SET role = 'admin', is_approved = 1 WHERE username = 'your_username';
```

---

## 4. Local Development (LAN Access)

หากต้องการรันเพื่อทดสอบในวงแลน (ให้เครื่องอื่นเข้าผ่าน IP ได้):

1. **Backend**:
   - `index.js` ถูกตั้งค่าให้ฟัง `0.0.0.0` แล้ว
   - แก้ `.env` ให้ `FRONTEND_URL=http://<YOUR_IP>:5173`

2. **Frontend**:
   - `vite.config.js` ถูกตั้งค่า `server.host: true` แล้ว
   - แก้ `.env` ให้ `VITE_API_URL=http://<YOUR_IP>:5001`

3. **Run**:
   - Server: `npm run dev`
   - Client: `npm run dev`
