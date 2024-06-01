const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, offerController.addOffer);
router.post('/apply', verifyToken, offerController.applyOffer);

module.exports = router;
