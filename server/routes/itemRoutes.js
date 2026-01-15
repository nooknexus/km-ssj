const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', itemController.getAllItems);
router.get('/category/:categoryId', itemController.getItemsByCategory);
router.get('/highlights', itemController.getHighlights);
router.get('/popular', itemController.getPopularItems); // New Popular Items Route
router.get('/new', itemController.getNewArrivals);
router.get('/search', itemController.searchItems); // New Search Route
router.get('/:id', itemController.getItemById); // New Get Single Item Route

// Protected routes
router.post('/history', authenticateToken, itemController.recordHistory);

// Admin/User routes for creating items (Requirement: User can add item)
// Modified: Allow usage by authenticated users, not just admin for creation?
// Constraint Check: Requirement 1 says "User login... add button". So removing isAdmin for create.
router.post('/', authenticateToken, upload.array('files', 10), itemController.createItem);

// Admin only routes
router.put('/:id', authenticateToken, isAdmin, itemController.updateItem); // New Update Route
router.delete('/:id', authenticateToken, isAdmin, itemController.deleteItem);

module.exports = router;
