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
    const { userId, amount, type } = req.body
    if ( !userId || !amount || !type  ) {
        return res.status(500).send("Bad Request")
    }
    transactionService.createTransaction({ userId, amount, type })
        .then((data) => {
            res.status(201).json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const deposit = (req, res, next) => {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
        return res.status(400).send("Bad Request");
    }
    transactionService.deposit({ userId, amount })
        .then(() => {
            res.status(201).json({ status: true });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = {
	getAllTransactions,
	getTransaction,
	createTransaction,
	getTransactionsByUser,
	deposit
}