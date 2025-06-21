const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware')

router.use('/auth', require('./authRoute'));

router.use(protect)
router.use('/user', require('./userRoute'));
router.use('/jobs', require('./jobsRoute'));
router.use('/transactions', require('./transactionsRoute'));
router.use('/withdrawalRequests', require('./withdrawalRequestsRoute'));
router.use('/errands', require('./errandRoute'))
router.use('/jobPosts', require('./jobPostsRoute'))

module.exports = router;