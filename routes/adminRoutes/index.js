const express = require('express');
const router = express.Router();
const { ensureUser } = require('../../middlewares/authMiddleware')

router.use('/auth', require('./authRoute'));

// router.use(ensureUser)
router.use('/users', require('./usersRoute'));
router.use('/withdrawalRequests', require('./withdrawalRequestsRoute'));

module.exports = router;