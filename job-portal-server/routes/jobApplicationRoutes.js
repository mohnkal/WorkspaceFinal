const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');

router.post('/submit-application', jobApplicationController.submitApplication);

module.exports = router;