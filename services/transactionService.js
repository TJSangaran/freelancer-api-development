const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.getAllTransactions = () => {
    return Transaction.find();
};

exports.getTransaction = async ({ transactionId }) => {
    return Transaction.findById(transactionId);
};

exports.createTransaction =async ({ userId, amount, type }) => {
    const transaction = new Transaction({
        userId,
        amount: Math.abs(amount),
        type,
    });
    const res=await transaction.save();
    await this.updateUserBalance(userId, amount, type)
    return res
};

exports.getTransactionsByUser = ({ userId }) => {
    return Transaction.find({ userId });
};

exports.updateUserBalance = async (userId, amount, transactionType) => {
    let inc = Math.abs(amount);
    if (transactionType === "withdrawal") {
        const user = await User.findById(userId);
        if (user.balance < Math.abs(amount)) {
            throw new Error("Insufficient balance");
        }
        inc = -Math.abs(amount);
    }
    return User.updateOne({ _id: userId }, { $inc: { balance: inc } });
};

exports.deposit = async ({ userId, amount }) => {
    const transaction = new Transaction({
        userId,
        amount,
        type: "deposit",
    });
    await transaction.save();
    return exports.updateUserBalance(userId, amount, "deposit");
};
