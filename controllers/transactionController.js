const transactionService = require('../services/transactionService');

const getAllTransactions = (req, res) => {
	transactionService.getAllTransactions()
		.then((data) => {
			res.json(data)
		})
		.catch((err) => {
			console.log(err)
			return res.status(500).send("Internal Server Error")
		})
}

const getTransaction = (req, res) => {
    const { transactionId } = req.params
    transactionService.getTransaction({ transactionId })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const getTransactionsByUser = (req, res) => {
    const { userId } = req.params
    transactionService.getTransactionsByUser({ userId })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const createTransaction = (req, res) => {
    const { userId, ammount, type } = req.body
    if ( !userId || !ammount || !type  ) {
        return res.status(500).send("Bad Request")
    }
    transactionService.createTransaction({ userId, ammount, type })
        .then((data) => {
            res.status(201).json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

module.exports = {
	getAllTransactions,
	getTransaction,
	createTransaction,
	getTransactionsByUser,
}