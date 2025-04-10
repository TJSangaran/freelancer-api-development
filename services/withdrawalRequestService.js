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
                ammount: 1,
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

exports.createWithdrawalRequest = async ({ userId, ammount }) => {
    const user = await User.findOne({ _id: userId });

    if (ammount > user.balance) {
        throw new Error("Insufficent balance");
    }

    const withdrawalRequest = new WithdrawalRequest({
        userId,
        ammount,
    });
    return withdrawalRequest.save();
};

exports.updateStatus = async ({ withdrawalRequestId, status }) => {
    if (status === "accecpted") {
        const withdrawalRequest = await WithdrawalRequest.findById(
            withdrawalRequestId
        );
        const user = await User.findOne({ _id: withdrawalRequest.userId });
        if (withdrawalRequest.ammount > user.balance) {
            throw new Error("Insufficent balance");
        }
        const transaction = new Transaction({
            userId: withdrawalRequest.userId,
            ammount: withdrawalRequest.ammount,
            type: "withdrawal",
        });
        await transaction.save();
        await transactionService.updateUserBalance(withdrawalRequest.userId, withdrawalRequest.ammount,"withdrawal")
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
