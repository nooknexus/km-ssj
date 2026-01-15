# Deployment Guide

This guide covers deployment for both **Local Network (LAN)** and **Production Server (Domain Name)**.

## 1. Environment Setup

### Frontend (`/client`)
Vite uses specific `.env` files based on the mode:
- **Development**: Uses `.env` (or `.env.development`).
- **Production (Build)**: Uses `.env.production`.

**For Production (`https://km.plkhealth.go.th`):**
Ensure `client/.env.production` exists with:
```env
VITE_API_URL=https://km.plkhealth.go.th
# If API is on a textfferent subdomain/port, adjust accordingly.
# Example: VITE_API_URL=https://api.km.plkhealth.go.th
```

### Backend (`/server`)
Node.js uses `.env` by default. For production, create a `.env` file on the server based on `.env.production.example`.

Key settings for Production:
```env
FRONTEND_URL=https://km.plkhealth.go.th
HEALTH_REDIRECT_URI=https://km.plkhealth.go.th/api/auth/healthid
CORS_ORIGIN=https://km.plkhealth.go.th
```

## 2. Deploying on Server

### Frontend
1. Build the production assets:
   ```bash
   cd client
   npm run build
   ```
2. The output is in the `dist` folder.
3. Serve this folder using Nginx or Apache.
   **Nginx Example:**
   ```nginx
   server {
       listen 80;
       server_name km.plkhealth.go.th;
       
       root /var/www/km-health/client/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to Backend
       location /api {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Backend
1. Install dependencies:
   ```bash
   cd server
   npm install --production
   ```
2. Use a process manager like **PM2** to run the server:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "km-backend"
   ```

## 3. Database Migration
Run the SQL migration scripts on your production database (MySQL/MariaDB).

## 4. Health ID SSO Configuration
Register your Production Redirect URI in the Health ID system:
- `https://km.plkhealth.go.th/api/auth/healthid`
