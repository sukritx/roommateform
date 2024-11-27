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

// Public routes
router.post('/', createSubmission);

// Protected routes
router.use(authenticateToken);
router.get('/my-submissions', getUserSubmissions);
router.get('/form/:formId', getSubmissions);
router.put('/:submissionId/status', updateSubmissionStatus);
router.put('/:submissionId/read', markAsRead);

module.exports = router; 