const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.getAllJobs);
router.get('/:jobId', jobController.getJob);
router.get('/errand/:errandId', jobController.getErrandJobs);
router.get('/jobPoster/:jobPosterId', jobController.getJobPosterJobs);
router.post('/', jobController.createJob);
router.put('/:jobId', jobController.updateJob);
router.delete('/:jobId', jobController.deleteJob);
router.put('/status/:jobId', jobController.updateStatus);
router.put('/errandReview/:jobId', jobController.addErrandReview);
router.put('/jobPosterReview/:jobId', jobController.addJobPosterReview);

module.exports = router;