const Wallet = require('../models/walletModel');
const User = require('../models/userModel');

// Check Wallet Balance
exports.checkWalletBalance = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in the request

        // Find the user's wallet
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for this user' });
        }

        // Respond with the wallet balance
        res.status(200).json({ balance: wallet.balance });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add Funds to Wallet
exports.addFundsToWallet = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in the request
        const { amount } = req.body;

        // Validate amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find or create the user's wallet
        let wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            wallet = new Wallet({
                user: userId,
                balance: 0 // Initialize balance
            });
        }

        // Add funds to the wallet (ensure balance doesn't go negative)
        wallet.balance += parseFloat(amount);
        
        // Ensure balance doesn't go negative
        if (wallet.balance < 0) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Save the updated wallet balance
        await wallet.save();

        // Respond with the updated wallet balance
        res.status(200).json({ message: 'Funds added to wallet successfully', balance: wallet.balance });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
