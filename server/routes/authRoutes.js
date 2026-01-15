const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// SSO Provider ID Routes
router.get('/sso/url', authController.getSSOUrl);
router.post('/sso/callback', authController.ssoCallback);

// Health ID OAuth Callback - รับ code จาก Health ID แล้ว redirect ไป frontend
router.get('/healthid', authController.healthIdCallback);

module.exports = router;
