# KM Health Client

Frontend application for the Health Knowledge Management System, built with **React** and **Vite**.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
cd client
npm install
```

## Environment Variables
Create a `.env` file in the `client` directory:

```env
# API URL (Use local IP for network access)
VITE_API_URL=http://<YOUR_LOCAL_IP>:5001

# Health ID (SSO) Configuration
HEALTH_CLIENT_ID=<your_health_id_client_id>
HEALTH_REDIRECT_URI=http://<YOUR_LOCAL_IP>:5001/api/auth/healthid

# Provider ID Configuration (If used)
PROVIDER_CLIENT_ID=<your_provider_id>
```

## Development
To start the development server (configured to listen on all network interfaces):

```bash
npm run dev
```
Access at: `http://<YOUR_LOCAL_IP>:5173`

## Build for Production

```bash
npm run build
```
The output will be in the `dist` directory.
