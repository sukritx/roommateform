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

// Public routes
router.get('/', getForms);
router.get('/:id', getFormById);

// Protected routes
router.use(authenticateToken); // All routes below this will require authentication

// Place specific routes before parameter routes
router.get('/my-listings', getMyListings);
router.post('/', fileUpload({ destination: 'room-images' }), createForm);

// Parameter routes should come last
router.put('/:id', updateForm);
router.post('/:id/favorite', toggleFavorite);
router.post('/:id/boost', boostListing);

module.exports = router; 