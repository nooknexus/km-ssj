const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/stats', dashboardController.getStats);
router.get('/history', authenticateToken, dashboardController.getUserHistory);

module.exports = router;
