const express = require('express');
const router = express.Router();
const jobPostController = require('../controllers/jobPostController');

router.get('/', jobPostController.getAllJobs);
router.get('/find/:jobId', jobPostController.getJob);
router.get('/editData/:jobId', (req, res, next) => { req.params.editData = true; next() }, jobPostController.getJob);
router.get('/my', jobPostController.getJobPosterJobs);
router.post('/', jobPostController.createJob);
router.put('/:jobId', jobPostController.updateJob);
router.delete('/:jobId', jobPostController.deleteJob);
router.put('/status/:jobId', jobPostController.updateStatus);

module.exports = router;