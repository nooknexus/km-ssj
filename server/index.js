const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
const result = dotenv.config();
if (result.error) {
    // If .env not found, try .env.production
    dotenv.config({ path: '.env.production' });
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://km.plkhealth.go.th' // Hardcode fallback for production
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            // For development convenience, you might want to allow all, but for prod be strict
            // callback(new Error('Not allowed by CORS'));
            callback(null, true); // Currently allowing all to prevent issues during setup
        }
    },
    credentials: true
}));
app.use(express.json());

// DEBUG LOGGING
const fs = require('fs');
const path = require('path');
app.use((req, res, next) => {
    const log = `${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`;
    try {
        fs.appendFileSync(path.join(__dirname, 'debug.log'), log);
    } catch (e) { console.error(e); }
    next();
});

// Basic Route
app.get('/', (req, res) => {
    res.send('KM Health System API is running');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/uploads', express.static('uploads'));

// Serve Frontend Static Files
const clientDistPath = path.join(__dirname, '../client/dist');
const htmlPath = path.join(clientDistPath, 'index.html');

// Check if frontend build exists
if (fs.existsSync(clientDistPath)) {
    console.log(`Serving frontend from: ${clientDistPath}`);
    app.use(express.static(clientDistPath));

    // SPA Fallback: For any route not handled by API, send index.html
    app.get('*', (req, res) => {
        if (req.originalUrl.startsWith('/api')) {
            // If it's an API call that wasn't handled above, return 404 JSON
            return res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
        }
        res.sendFile(htmlPath);
    });
} else {
    console.log('Frontend build not found. Running in API-only mode.');
}

// 404 Handler for API only (since catch-all above handles frontend)
app.use((req, res) => {
    console.log(`404 Hit: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (accessible on all network interfaces)`);
});
// Trigger restart
