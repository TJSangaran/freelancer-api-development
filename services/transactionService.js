const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.getAllTransactions = () => {
    return Transaction.find();
};

exports.getTransaction = async ({ transactionId }) => {
    return Transaction.findById(transactionId);
};

exports.createTransaction =async ({ userId, ammount, type }) => {
    const transaction = new Transaction({
        userId,
        ammount: Math.abs(ammount),
        type,
    });
    const res=await transaction.save();
    await this.updateUserBalance(userId, ammount, type)
    return res
};

exports.getTransactionsByUser = ({ userId }) => {
    return Transaction.find({ userId });
};

exports.updateUserBalance = async (userId, ammount, transactionType) => {
    let inc = Math.abs(ammount);
    if (transactionType === "withdrawal") {
        inc = -Math.abs(ammount);
    }
    return User.updateOne({ _id: userId }, { $inc: { balance: inc } });
};
