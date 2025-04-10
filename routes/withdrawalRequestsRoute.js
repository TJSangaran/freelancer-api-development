const express = require('express');
const router = express.Router();
const withdrawalRequestController = require('../controllers/withdrawalRequestController');

router.get('/', withdrawalRequestController.getAllWithdrawalRequests);
router.get('/:withdrawalRequestId', withdrawalRequestController.getWithdrawalRequest);
router.post('/', withdrawalRequestController.createWithdrawalRequest);
router.put('/status/:withdrawalRequestId', withdrawalRequestController.updateStatus);

module.exports = router;