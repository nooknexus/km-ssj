const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

// 404 Handler
app.use((req, res) => {
    console.log(`404 Hit: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (accessible on all network interfaces)`);
});
// Trigger restart
