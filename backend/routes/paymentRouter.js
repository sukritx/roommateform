const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { 
  createPaymentIntent, 
  handlePaymentSuccess,
  getPaymentHistory 
} = require('../controllers/paymentController');

const router = express.Router();

router.use(authenticateToken); // All payment routes require authentication

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', handlePaymentSuccess);
router.get('/history', getPaymentHistory);

module.exports = router; 