const WithdrawalRequest = require("../../models/WithdrawalRequest");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");

exports.getAllWithdrawalRequests = () => {
    return WithdrawalRequest.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                amount: 1,
                createdAt: 1,
                status: 1,
                userPhone: '$user.phone',
                userEmail: '$user.email',
                'user.firstname': 1,
                'user.lastname': 1,
                'user.phone': 1,
                'user.email': 1,
                'user.bankname': 1,
                'user.accountname': 1,
                'user.accountnumber': 1
            }
        }
    ]);
};

exports.getWithdrawalRequest = async ({ withdrawalRequestId }) => {
    return WithdrawalRequest.findById(withdrawalRequestId);
};

exports.updateStatus = async ({ withdrawalRequestId, status }) => {
    if (status === "accecpted") {
        const withdrawalRequest = await WithdrawalRequest.findById(
            withdrawalRequestId
        );
        const user = await User.findOne({ _id: withdrawalRequest.userId });
        if (withdrawalRequest.amount > user.balance) {
            throw new Error("Insufficent balance");
        }
        const transaction = new Transaction({
            userId: withdrawalRequest.userId,
            amount: withdrawalRequest.amount,
            type: "withdrawal",
        });
        await transaction.save();
        await User.updateOne({ _id: withdrawalRequest.userId }, { $inc: { balance: -withdrawalRequest.amount } });
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
