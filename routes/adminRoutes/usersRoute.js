const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');

router.get('/', userController.getAllUsers)
router.get('/:userId', userController.getUser)
router.get('/profile/:userId', userController.getUserProfile)
router.put('/ban/:userId', userController.updateBannedStatus)
router.put('/:userId', userController.updateUserInfo)

module.exports = router;