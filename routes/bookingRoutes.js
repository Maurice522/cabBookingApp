const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Route to book a cab
router.post('/', verifyToken, bookingController.bookCab);

// Route to get booking history
router.get('/history',verifyToken, bookingController.getBookingHistory);

module.exports = router;
