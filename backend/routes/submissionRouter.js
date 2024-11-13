const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { 
  createSubmission, 
  getSubmissions, 
  updateSubmissionStatus, 
  markAsRead 
} = require('../controllers/submissionController');

const router = express.Router();

// All submission routes require authentication
router.use(authenticateToken);

router.post('/', createSubmission);
router.get('/form/:formId', getSubmissions);
router.put('/:submissionId/status', updateSubmissionStatus);
router.put('/:submissionId/read', markAsRead);

module.exports = router; 