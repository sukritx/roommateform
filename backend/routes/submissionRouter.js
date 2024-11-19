const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { 
  createSubmission, 
  getSubmissions, 
  updateSubmissionStatus, 
  markAsRead,
  getUserSubmissions
} = require('../controllers/submissionController');

const router = express.Router();

// All submission routes require authentication
router.use(authenticateToken);

router.post('/', createSubmission);
router.get('/my-submissions', getUserSubmissions);
router.get('/form/:formId', getSubmissions);
router.put('/:submissionId/status', updateSubmissionStatus);
router.put('/:submissionId/read', markAsRead);

module.exports = router; 