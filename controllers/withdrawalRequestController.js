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

const createWithdrawalRequest = (req, res, next) => {
    const { userId, ammount } = req.body
    console.log( { userId, ammount })
    if ( !userId || !ammount  ) {
        return res.status(500).send("Bad Request")
    }
    withdrawalRequestService.createWithdrawalRequest({ userId, ammount })
        .then(() => {
            res.status(201).json({ status: true })
        })
        .catch((err) => {
            next({error:"Insufficent balance"})
        })
}

const updateStatus = (req, res, next) => {
    const { withdrawalRequestId } = req.params
    const { status } = req.body
    if ( status === undefined ) {
        return res.status(500).send("Bad Request")
    }
    withdrawalRequestService.updateStatus({ withdrawalRequestId, status })
        .then(() => {
            res.status(201).json({ status: true })
        })
        .catch((err) => {
            console.log(err)
            next({error:"Insufficent balance"})
        })
}

module.exports = {
	getAllWithdrawalRequests,
	getWithdrawalRequest,
	createWithdrawalRequest,
	updateStatus,
}