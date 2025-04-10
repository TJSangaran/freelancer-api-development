const express = require('express');
const router = express.Router();
const { ensureUser } = require('../middlewares/authMiddleware')

router.use('/auth', require('./authRoute'));

router.use(ensureUser)
router.use('/user', require('./userRoute'));
router.use('/jobs', require('./jobsRoute'));
router.use('/transactions', require('./transactionsRoute'));
router.use('/withdrawalRequests', require('./withdrawalRequestsRoute'));
router.use('/errands', require('./errandRoute'))
router.use('/jobPosts', require('./jobPostsRoute'))

module.exports = router;