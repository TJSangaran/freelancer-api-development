const express = require('express');
const router = express.Router();
const withdrawalRequestController = require('../../controllers/admin/withdrawalRequestController');

router.get('/', withdrawalRequestController.getAllWithdrawalRequests);
router.get('/:withdrawalRequestId', withdrawalRequestController.getWithdrawalRequest);
router.put('/status/:withdrawalRequestId', withdrawalRequestController.updateStatus);

module.exports = router;