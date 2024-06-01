const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to initiate payment
router.post('/initiate', verifyToken, paymentController.initiatePayment);

// Route to confirm payment
router.post('/confirm', verifyToken, paymentController.confirmPayment);

module.exports = router;
