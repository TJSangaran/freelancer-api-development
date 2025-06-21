const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/deposit', transactionController.deposit);
router.get('/user/:userId', transactionController.getTransactionsByUser);

module.exports = router;