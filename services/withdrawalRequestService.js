const WithdrawalRequest = require("../models/WithdrawalRequest");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const transactionService = require('./transactionService');

exports.getAllWithdrawalRequests = () => {
    return WithdrawalRequest.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: '_user'
            }
        },
        {
            $unwind: "$_user"
        },
        {
            $project: {
                _id: 1,
                amount: 1,
                createdAt: 1,
                status: 1,
                userName: { $concat:['$_user.firstname', ' ', '$_user.lastname']},
                userPhone: '$_user.phone',
                userEmail: '$_user.email'
            }
        }
    ]);
};

exports.getWithdrawalRequest = async ({ withdrawalRequestId }) => {
    return WithdrawalRequest.findById(withdrawalRequestId);
};

exports.createWithdrawalRequest = async ({ userId, amount }) => {
    const user = await User.findOne({ _id: userId });

    if (amount > user.balance) {
        throw new Error("Insufficient balance");
    }

    const withdrawalRequest = new WithdrawalRequest({
        userId,
        amount,
    });
    return withdrawalRequest.save();
};

exports.updateStatus = async ({ withdrawalRequestId, status }) => {
    if (status === "accecpted") {
        const withdrawalRequest = await WithdrawalRequest.findById(
            withdrawalRequestId
        );
        const user = await User.findOne({ _id: withdrawalRequest.userId });
        if (withdrawalRequest.amount > user.balance) {
            throw new Error("Insufficient balance");
        }
        const transaction = new Transaction({
            userId: withdrawalRequest.userId,
            amount: withdrawalRequest.amount,
            type: "withdrawal",
        });
        await transaction.save();
        await transactionService.updateUserBalance(withdrawalRequest.userId, withdrawalRequest.amount,"withdrawal")
    }
    return WithdrawalRequest.updateOne(
        { _id: withdrawalRequestId },
        {
            $set: {
                status,
            },
        }
    );
};
