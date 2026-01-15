const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, isAdmin, userController.getAllUsers);
router.post('/', authenticateToken, isAdmin, userController.addUser);
router.put('/:id/password', authenticateToken, isAdmin, userController.updateUserPassword);
router.put('/:id/role', authenticateToken, isAdmin, userController.updateUserRole);
router.put('/:id/approve', authenticateToken, isAdmin, userController.updateUserApproval);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;
