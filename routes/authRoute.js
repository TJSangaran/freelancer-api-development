const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const { ensureOTP } = require('../../middlewares/authMiddleware')

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/refreshToken', authController.tokenRefresh)
router.post('/forgotPassword/email', authController.forgotPassword)
// router.get('/forgotPassword', ensureOTP, authController.getTokenDetail)
router.post('/forgotPassword/verify', authController.verifyOTP)
router.post('/forgotPassword/reset', authController.resetPassword)

module.exports = router;