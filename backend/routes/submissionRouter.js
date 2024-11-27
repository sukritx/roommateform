const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { 
  createSubmission,
  getUserSubmissions,
  getSubmissions,
  updateSubmissionStatus,
  markAsRead
} = require('../controllers/submissionController');

const router = express.Router();

// Public routes - no authentication required
router.post('/', createSubmission);

// Protected routes - require authentication
router.use(authenticateToken);
router.get('/my-submissions', getUserSubmissions);
router.get('/form/:formId', getSubmissions);
router.put('/:submissionId/status', updateSubmissionStatus);
router.put('/:submissionId/read', markAsRead);

module.exports = router;