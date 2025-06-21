const jobService = require('../services/jobService');

const getAllJobs = (req, res) => {
	jobService.getAllJobs()
		.then((data) => {
			res.json(data)
		})
		.catch((err) => {
			console.log(err)
			return res.status(500).send("Internal Server Error")
		})
}

const getJob = (req, res) => {
    const { jobId } = req.params
    jobService.getJob({ jobId })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const getErrandJobs = (req, res) => {
    const { errandId } = req.params
    jobService.getErrandJobs({ errandId })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const getJobPosterJobs = (req, res) => {
    const { jobPosterId } = req.params
    jobService.getJobPosterJobs({ jobPosterId })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const createJob = (req, res) => {
    const { title, body, price, days, status, errandId, jobPosterId } = req.body
    const user = req.user;
    if ( !title || !body || (price ===undefined) || !days || !status || !errandId || !jobPosterId  ) {
        return res.status(500).send("Bad Request")
    }
    jobService.createJob({userId: user.user._id, title, body, price, days, status, errandId, jobPosterId })
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
    const { title, body, price, days, status } = req.body
    if ( !title || !body || (price ===undefined) || !days || !status  ) {
        return res.status(500).send("Bad Request")
    }
    jobService.updateJob({ jobId, title, body, price, days, status })
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
    jobService.deleteJob({ jobId })
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
    if ( status === undefined ) {
        return res.status(500).send("Bad Request")
    }
    jobService.updateStatus({ jobId, status })
        .then(() => {
            res.status(201).json({ status: true })
        })
        .catch((err) => {
            console.log(err)
            return res.status(400).send(err.message)
        })
}

const addErrandReview = (req, res) => {
    const { jobId } = req.params
    const { errandReview } = req.body
    if ( errandReview === undefined ) {
        return res.status(500).send("Bad Request")
    }
    jobService.addErrandReview({ jobId, errandReview })
        .then(() => {
            res.status(201).json({ status: true })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

const addJobPosterReview = (req, res) => {
    const { jobId } = req.params
    const { jobPosterReview } = req.body
    if ( jobPosterReview === undefined ) {
        return res.status(500).send("Bad Request")
    }
    jobService.addJobPosterReview({ jobId, jobPosterReview })
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
    getErrandJobs,
    getJobPosterJobs,
    addErrandReview,
    addJobPosterReview
}