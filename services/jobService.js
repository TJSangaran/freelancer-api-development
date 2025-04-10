const Job = require('../models/Job');
const User = require('../models/User');
const userServiec = require('./userService')
const transactionService = require('./transactionService')
const mongoose = require('mongoose')

exports.getAllJobs = () => {
    return Job.find()
}

exports.getJob = async ({ jobId }) => {
    return Job.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(jobId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'errandId',
                foreignField: '_id',
                as: 'errand'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'jobPosterId',
                foreignField: '_id',
                as: 'jobPoster'
            }
        }
    ]).then(data => data[0])
}

exports.getErrandJobs = ({ errandId }) => {
    return Job.aggregate([
        {
            $match: { errandId: mongoose.Types.ObjectId(errandId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'jobPosterId',
                foreignField: '_id',
                as: 'jobPoster'
            }
        }
    ])
}

exports.getJobPosterJobs = ({ jobPosterId }) => {
    return Job.aggregate([
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

exports.createJob = async ({ userId, title, body, price, days, status, errandId, jobPosterId }) => {
    const spendableBalance = await userServiec.getSpendableBalance(userId)
    if (spendableBalance < price) {
        throw new Error("The balance is not enough.")
    }
    const job = new Job({
        title, body, price, days, status, errandId, jobPosterId
    })
    return job.save()
}

exports.updateJob = ({ jobId, title, body, price, days, status }) => {
    return Job.updateOne({ _id: jobId }, {
        $set: { title, body, price, days, status }
    })
}

exports.deleteJob = ({ jobId }) => {
    return Job.deleteOne({ _id: jobId })
}

exports.updateStatus = async ({ jobId, status }) => {
    if (status == "completed") {
        const job = await Job.findById(jobId)
        await transactionService.createTransaction({ userId: job.errandId, ammount: job.price, type: "deposit" })
        await transactionService.createTransaction({ userId: job.jobPosterId, ammount: job.price, type: "withdrawal" })
    }
    return Job.updateOne({ _id: jobId }, {
        $set: {
            status
        }
    })
}

exports.addErrandReview = async ({ jobId, errandReview }) => {
    const job = await Job.findOneAndUpdate({ _id: jobId }, {
        $set: {
            errandReview
        }
    })
    const jobPoster = await User.findById(job.jobPosterId)
    const { avgRating, noOfRatings } = jobPoster;
    jobPoster.noOfRatings += 1;
    jobPoster.avgRating = (avgRating * noOfRatings + errandReview.rating) / (noOfRatings + 1)
    await jobPoster.save()
    return job
}

exports.addJobPosterReview = async ({ jobId, jobPosterReview }) => {
    const job = await Job.findOneAndUpdate({ _id: jobId }, {
        $set: {
            jobPosterReview
        }
    })
    const errand = await User.findById(job.errandId)
    const { avgRating, noOfRatings } = errand;
    errand.noOfRatings += 1;
    errand.avgRating = (avgRating * noOfRatings + jobPosterReview.rating) / (noOfRatings + 1)
    await errand.save()
    return job
}
