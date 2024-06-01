const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel');
const Wallet = require('../models/walletModel');

// Mock payment service
const mockPaymentService = {
    initiatePayment: async (amount, paymentMethod) => {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { status: 'success', transactionId: `txn_${Date.now()}` };
    }
};

// Initiate Payment
exports.initiatePayment = async (req, res) => {
    try {
        const { bookingId, paymentMethod } = req.body;

        // Validate required fields
        if (!bookingId || !paymentMethod) {
            return res.status(400).json({ message: 'Booking ID and payment method are required' });
        }

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Find the user
        const user = await User.findById(booking.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if booking is already paid
        if (booking.status === 'Paid') {
            return res.status(400).json({ message: 'Booking is already paid' });
        }

        // Initiate payment through the mock payment service
        const paymentResponse = await mockPaymentService.initiatePayment(booking.totalAmount, paymentMethod);

        // Check payment status
        if (paymentResponse.status !== 'success') {
            return res.status(400).json({ message: 'Payment failed' });
        }

        // Create a payment record
        const payment = new Payment({
            user: booking.user,
            booking: booking._id,
            amount: booking.totalAmount,
            method: paymentMethod,
            transactionId: paymentResponse.transactionId,
            status: 'Pending'
        });

        // Save the payment record
        await payment.save();

        // Respond with the payment details
        res.status(201).json({ message: 'Payment initiated successfully', payment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Confirm Payment
exports.confirmPayment = async (req, res) => {
    try {
        const { transactionId } = req.body;

        // Validate required fields
        if (!transactionId) {
            return res.status(400).json({ message: 'Transaction ID is required' });
        }

        // Find the payment
        const payment = await Payment.findOne({ transactionId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check if payment is already confirmed
        if (payment.status === 'Confirmed') {
            return res.status(400).json({ message: 'Payment is already confirmed' });
        }

        // Confirm the payment
        payment.status = 'Confirmed';
        await payment.save();

        // Update the booking status to 'Paid'
        const booking = await Booking.findById(payment.booking);
        booking.status = 'Paid';
        await booking.save();

        // Update the user's wallet balance if the payment method is 'wallet'
        if (payment.method === 'wallet') {
            const wallet = await Wallet.findOne({ user: payment.user });
            wallet.balance -= payment.amount;
            await wallet.save();
        }

        // Respond with the confirmed payment details
        res.status(200).json({ message: 'Payment confirmed successfully', payment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
