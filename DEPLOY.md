# Deployment Guide (Network / LAN Access)

This guide describes how to deploy and configure the KM Health system to be accessible across a local network (LAN).

## 1. Prerequisites
- **Host Machine IP**: Identify the local IP address of the host machine (e.g., `192.168.199.88`).
- **MySQL**: Ensure MySQL is running and accessible.
- **Node.js**: Installed on the host machine.

## 2. Configuration

### Backend (`/server`)
1. Edit `.env` to use the Host IP for Redirect URIs:
   ```env
   # Adjust to match your machine's IP
   HEALTH_REDIRECT_URI=http://192.168.199.88:5001/api/auth/healthid
   FRONTEND_URL=http://192.168.199.88:5173
   ```
2. Ensure `index.js` listens on `0.0.0.0` (Already configured).

### Frontend (`/client`)
1. Edit `.env` to point to the Backend IP:
   ```env
   VITE_API_URL=http://192.168.199.88:5001
   ```
2. Ensure `vite.config.js` has `server.host: true` (Already configured).

## 3. Database Migration
Ensure all recent SQL migrations are applied:
1. `migrate_sso.sql`: Updates user table for Health ID.
2. `migrate_add_approval.sql`: Adds `is_approved` column for admin verification.

## 4. Running the Application

### Start Backend
```bash
cd server
npm run dev
# Server runs on 0.0.0.0:5001
```

### Start Frontend
```bash
cd client
npm run dev
# Vite runs on 0.0.0.0:5173
```

## 5. Accessing from Clients
Other devices on the same network can now access:
- **Web App**: `http://192.168.199.88:5173`
- **Login**: System will redirect to Health ID and back to this IP securely.

## 6. Admin Setup
1. The first user login/register via SSO will be **Pending Approval**.
2. Manually set the first admin in database:
   ```sql
   UPDATE users SET role = 'admin', is_approved = 1 WHERE username = 'your_username';
   ```
3. Use the Admin Panel (`/admin`) to approve subsequent users.
