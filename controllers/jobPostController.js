const jobPostService = require('../services/jobPostService');

const getAllJobs = (req, res) => {
    jobPostService.getAllJobs()
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const getJob = (req, res) => {
    const { jobId, editData } = req.params;
    const userId = req.user.user._id
    jobPostService.getJob({ jobId, userId, editData })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const getJobPosterJobs = (req, res) => {
    const jobPosterId = req.user.user._id;
    jobPostService.getJobPosterJobs({ jobPosterId })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const createJob = (req, res) => {
    const { title, body, priceFrom, priceTo, days, public, tags } = req.body;
    const jobPosterId = req.user.user._id
    if (!title || !body || !priceFrom || !priceTo || !days) {
        return res.status(400).send("Bad Request")
    }
    jobPostService.createJob({ title, body, priceFrom, priceTo, days, public, tags, jobPosterId })
        .then((data) => {
            res.status(201).json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const updateJob = (req, res) => {
    const { jobId } = req.params
    const { title, body, priceFrom, priceTo, days, public, tags } = req.body
    if (!title || !body || !priceFrom || !priceTo || !days) {
        return res.status(500).send("Bad Request")
    }
    jobPostService.updateJob({ jobId, title, body, priceFrom, priceTo, days, public, tags })
        .then(() => {
            res.status(201).json({ status: true })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const deleteJob = (req, res) => {
    const { jobId } = req.params
    jobPostService.deleteJob({ jobId })
        .then(() => {
            res.status(201).json({ status: true })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const updateStatus = (req, res) => {
    const { jobId } = req.params
    const { status } = req.body
    if (status === undefined) {
        return res.status(500).send("Bad Request")
    }
    jobPostService.updateStatus({ jobId, status })
        .then(() => {
            res.status(201).json({ status: true })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    updateStatus,
    getJobPosterJobs,
}