const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.get('/', categoryController.getAllCategories);
router.post('/', authenticateToken, isAdmin, upload.single('image'), (req, res, next) => {
    console.log('Hit POST /api/categories');
    next();
}, categoryController.createCategory);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
