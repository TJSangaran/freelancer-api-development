const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers)
router.get('/me', userController.getMe)
router.get('/profile', userController.getMyProfile)
router.get('/spendableBalance', userController.getSpendableBalance)
router.get('/:userId', userController.getUser)
router.get('/profile/:userId', userController.getUserProfile)
router.put('/', userController.updateInfo)
router.put('/update/:userId', userController.updateAUserInfo)
router.put('/password', userController.changePassword)
router.put('/ban/:userId', userController.updateBannedStatus)

module.exports = router;