const withdrawalRequestService = require('../../services/admin/withdrawalRequestService');

const getAllWithdrawalRequests = (req, res) => {
    withdrawalRequestService.getAllWithdrawalRequests()
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const getWithdrawalRequest = (req, res) => {
    const { withdrawalRequestId } = req.params
    withdrawalRequestService.getWithdrawalRequest({ withdrawalRequestId })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const updateStatus = (req, res, next) => {
    const { withdrawalRequestId } = req.params
    const { status } = req.body
    if (status === undefined) {
        return res.status(500).send("Bad Request")
    }
    withdrawalRequestService.updateStatus({ withdrawalRequestId, status })
        .then(() => {
            res.status(201).json({ status: true })
        })
        .catch((err) => {
            console.log(err)
            next({ error: "Insufficent balance" })
        })
}

module.exports = {
    getAllWithdrawalRequests,
    getWithdrawalRequest,
    updateStatus,
}