const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/balance', verifyToken, walletController.checkWalletBalance);
router.post('/add', verifyToken, walletController.addFundsToWallet);

module.exports = router;
