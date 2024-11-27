const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { fileUpload } = require('../middleware/file-upload');
const { 
  createForm, 
  getForms, 
  getFormById, 
  updateForm, 
  toggleFavorite,
  boostListing,
  getMyListings 
} = require('../controllers/formController');

const router = express.Router();

// Public routes - exact matches first
router.get('/', getForms);

// Protected routes with specific paths
router.get('/my-listings', authenticateToken, getMyListings);
router.post('/create', authenticateToken, fileUpload({ destination: 'room-images' }), createForm);
router.put('/edit/:id', authenticateToken, updateForm);
router.post('/favorite/:id', authenticateToken, toggleFavorite);
router.post('/boost/:id', authenticateToken, boostListing);

// Wildcard route must be last
router.get('/:id', getFormById);

module.exports = router;