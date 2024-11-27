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

// Public routes - no authentication required
router.get('/', getForms);

// Protected routes - require authentication
router.use(authenticateToken);
router.get('/my-listings', getMyListings);
router.post('/', fileUpload({ destination: 'room-images' }), createForm);
router.put('/:id', updateForm);
router.post('/:id/favorite', toggleFavorite);
router.post('/:id/boost', boostListing);

// Public route that needs to be after protected routes to avoid conflicts
router.get('/:id', getFormById);

module.exports = router;