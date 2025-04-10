const JobPost = require('../models/JobPost');
const User = require('../models/User');
const userServiec = require('./userService')
const transactionService = require('./transactionService')
const mongoose = require('mongoose')

exports.getAllJobs = () => {
    return JobPost.aggregate([
        {
            $match: { public: true }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'jobPosterId',
                foreignField: '_id',
                as: 'jobPoster'
            }
        },
        {
            $addFields: {
                jobPoster: {
                    $arrayElemAt: ['$jobPoster', 0]
                }
            }
        },
        {
            $project: {
                title: 1,
                body: 1,
                jobPosterid: 1,
                priceFrom: 1,
                priceTo: 1,
                days: 1,
                tags: 1,
                jobPoster: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    profileColor: 1,
                },
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])
}

exports.getJob = async ({ jobId, userId, editData }) => {
    return JobPost.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(jobId), ...(editData ? { jobPosterId: mongoose.Types.ObjectId(userId) } : {}) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'jobPosterId',
                foreignField: '_id',
                as: 'jobPoster'
            }
        },
        {
            $addFields: {
                jobPoster: {
                    $arrayElemAt: ['$jobPoster', 0]
                }
            }
        },
        {
            $project: {
                title: 1,
                body: 1,
                jobPosterid: 1,
                priceFrom: 1,
                priceTo: 1,
                days: 1,
                tags: 1,
                public: 1,
                jobPoster: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    profileColor: 1,
                }
            }
        }
    ]).then(data => data[0])
}

exports.getJobPosterJobs = ({ jobPosterId }) => {
    return JobPost.aggregate([
        {
            $match: { jobPosterId: mongoose.Types.ObjectId(jobPosterId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'errandId',
                foreignField: '_id',
                as: 'errand'
            }
        }
    ])
}

exports.createJob = async ({ title, body, priceFrom, priceTo, days, public, tags, jobPosterId }) => {
    const job = new JobPost({
        title, body, priceFrom, priceTo, days, public, tags, jobPosterId
    })
    return job.save()
}

exports.updateJob = ({ jobId, title, body, priceFrom, priceTo, days, public, tags }) => {
    return JobPost.updateOne({ _id: jobId }, {
        $set: { title, body, priceFrom, priceTo, days, public, tags }
    })
}

exports.deleteJob = ({ jobId }) => {
    return JobPost.deleteOne({ _id: jobId })
}

exports.updateStatus = async ({ jobId, status }) => {
    if (status == "completed") {
        const job = await JobPost.findById(jobId)
        await transactionService.createTransaction({ userId: job.errandId, ammount: job.price, type: "deposit" })
        await transactionService.createTransaction({ userId: job.jobPosterId, ammount: job.price, type: "withdrawal" })
    }
    return JobPost.updateOne({ _id: jobId }, {
        $set: {
            status
        }
    })
}