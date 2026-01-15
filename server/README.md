# KM Health Server

Backend API for the Health Knowledge Management System, built with **Node.js**, **Express**, and **MySQL**.

## Prerequisites
- Node.js (v16 or higher)
- MySQL Database

## Installation

```bash
cd server
npm install
```

## Database Setup
1. Create a MySQL database named `km_db`.
2. Import the schema and migration files in order:
    - `db_schema.sql` (Initial schema)
    - `migrate_sso.sql` (SSO support)
    - `migrate_add_approval.sql` (User approval system)

## Environment Variables
Create a `.env` file in the `server` directory:

```env
# Database Configuration
DB_HOST=database.lamp.orb.local
DB_USER=root
DB_PASSWORD=root
DB_NAME=km_db

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Server Port
PORT=5001

# Health ID OAuth (SSO)
HEALTH_CLIENT_ID=<your_client_id>
HEALTH_CLIENT_SECRET=<your_client_secret>
HEALTH_REDIRECT_URI=http://<YOUR_LOCAL_IP>:5001/api/auth/healthid

# Frontend URL (For Redirects)
FRONTEND_URL=http://<YOUR_LOCAL_IP>:5173
```

## Running the Server
The server is configured to list on `0.0.0.0` (all network interfaces).

```bash
# Development mode (with nodemon)
npm run dev

# Production
node index.js
```
API Access: `http://<YOUR_LOCAL_IP>:5001`
