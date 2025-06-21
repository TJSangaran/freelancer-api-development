const withdrawalRequestService = require('../services/withdrawalRequestService');

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

const createWithdrawalRequest = async (req, res, next) => {
    try {
        const { userId, amount } = req.body
        console.log({ userId, amount })
        if (!userId || !amount) {
            return res.status(400).send("Bad Request")
        }
        await withdrawalRequestService.createWithdrawalRequest({ userId, amount })
        res.status(201).json({ status: true })
    } catch (err) {
        next(err)
    }
}

const updateStatus = async (req, res, next) => {
    try {
        const { withdrawalRequestId } = req.params
        const { status } = req.body
        if (status === undefined) {
            return res.status(400).send("Bad Request")
        }
        await withdrawalRequestService.updateStatus({ withdrawalRequestId, status })
        res.status(201).json({ status: true })
    } catch (err) {
        next(err)
    }
}

module.exports = {
	getAllWithdrawalRequests,
	getWithdrawalRequest,
	createWithdrawalRequest,
	updateStatus,
}