const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const Job = require('../models/Job');

exports.getAllUsers = (_id) => {
    return User.aggregate([
        {
            $project: {
                password: 0
            }
        }
    ])
}

exports.getMe = (_id) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return Promise.resolve(null);
    }
    return User.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(_id) }
        },
        {
            $project: {
                password: 0
            }
        }
    ]).then(data => data[0])
}

exports.getMyProfile = async (_id) => {
    const user = await User.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(_id) }
        },
        {
            $project: {
                password: 0
            }
        }
    ]).then(data => data[0])

    let pipeline;

    if (user.isErrand) {

        pipeline = [
            {
                $match: { errandId: mongoose.Types.ObjectId(_id) }
            },
            {
                $addFields: {
                    review: '$jobPosterReview'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'jobPosterId',
                    foreignField: '_id',
                    as: 'counterParty'
                }
            }
        ]
    } else {
        pipeline = [
            {
                $match: { jobPosterId: mongoose.Types.ObjectId(_id) }
            },
            {
                $addFields: {
                    review: '$errandReview'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'errandId',
                    foreignField: '_id',
                    as: 'counterParty'
                }
            }
        ]
    }

    const jobs = await Job.aggregate([
        ...pipeline,
        {
            $addFields: {
                counterParty: {
                    $arrayElemAt: [{
                        $map: {
                            input: '$counterParty',
                            as: 'party',
                            in: {
                                _id: '$$party._id',
                                firstname: '$$party.firstname',
                                lastname: '$$party.lastname',
                                email: '$$party.email',
                                profileColor: '$$party.profileColor',
                            }
                        }
                    }, 0]
                }
            }
        },
    ])

    return { user: user, jobs }
}

exports.getUser = async (userId) => {
    return User.findById(userId);
};

exports.changeInfo = (userId, { firstname, lastname, phone, description, tags, address, dob, readyToWork }) => {
    return User.updateOne({ _id: userId }, {
        $set: { firstname, lastname, phone, description, tags, address, dob, readyToWork }
    })
}

exports.changePassword = async (id, { oldPassword, newPassword }) => {
    try {
        const user = await User.findOne({ _id: id })

        if (user && (await bcrypt.compare(oldPassword, user.password))) {
            const result = await changeUserPassword(id, newPassword)
            return "Password changed"
        } else {
            console.log("User not found/ pasword didn't match")
            throw new Error("User not found/ pasword didn't match")
        }
    } catch (error) {
        console.log(error)
        throw new Error("Error occured")
    }
}

exports.updateInfo = (id, { firstname, lastname }) => {
    return User.updateOne({ _id: id }, {
        $set: { firstname, lastname }
    })
}

exports.updateAUserInfo = ({ userId, firstname, lastname, phone, description, tags, address, dob, readyToWork }) => {
    return User.updateOne({ _id: userId }, {
        $set: { firstname, lastname, phone, description, tags, address, dob, readyToWork }
    })
}

const changeUserPassword = async (id, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const result = await User.updateOne({ _id: id }, {
        $set: { password: hashedPassword }
    })
    return result
}

exports.getSpendableBalance = async (userId) => {
    const user = await User.findById(userId);
    const jobs = await Job.aggregate([
        {
            $match: {
                jobPosterId: mongoose.Types.ObjectId(userId),
                status: { $in: ["initiated", "accecpted", "completeRequested"] }
            },
        },
    ]);
    const usedForJobsInitiation = jobs.reduce((sum, job) => sum + job.price, 0)
    const spendableBalance = user.balance - usedForJobsInitiation
    return { spendableBalance, balance: user.balance }
};

exports.updateBannedStatus = ({ userId, banned }) => {
    return User.updateOne({ _id: userId }, {
        $set: { banned }
    })
}