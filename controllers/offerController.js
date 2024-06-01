const Offer = require('../models/offerModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

// Add a new offer
exports.addOffer = async (req, res) => {
    try {
        const { code, discount, conditions, expiresAt } = req.body;

        // Validate required fields
        if (!code || !discount || !expiresAt) {
            return res.status(400).json({ message: 'Code, discount, and expiration date are required' });
        }

        // Check if the offer already exists
        const existingOffer = await Offer.findOne({ code });
        if (existingOffer) {
            return res.status(400).json({ message: 'Offer code already exists' });
        }

        // Create a new offer
        const newOffer = new Offer({
            code,
            discount,
            conditions,
            expiresAt
        });

        // Save the offer to the database
        await newOffer.save();

        // Respond with the offer details
        res.status(201).json({ message: 'Offer added successfully', offer: newOffer });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Apply an offer to a booking
exports.applyOffer = async (req, res) => {
    try {
        const { bookingId, offerCode } = req.body;

        // Validate required fields
        if (!bookingId || !offerCode) {
            return res.status(400).json({ message: 'Booking ID and offer code are required' });
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

        // Find the offer
        const offer = await Offer.findOne({ code: offerCode });
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        // Check if the offer has expired
        if (offer.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'Offer has expired' });
        }

        // Apply conditions
        if (offer.conditions.newUser && user.bookings.length > 0) {
            return res.status(400).json({ message: 'Offer only applicable for new users' });
        }

        if (offer.conditions.minCabPrice && booking.totalAmount < offer.conditions.minCabPrice) {
            return res.status(400).json({ message: `Offer applicable only for bookings with minimum price of ${offer.conditions.minCabPrice}` });
        }

        if (offer.conditions.cabType && booking.vehicleType.toString() !== offer.conditions.cabType) {
            return res.status(400).json({ message: `Offer applicable only for ${offer.conditions.cabType} type cabs` });
        }

        // Calculate the discount and apply it to the booking
        const discountAmount = (booking.totalAmount * offer.discount) / 100;
        booking.totalAmount -= discountAmount;
        booking.offerApplied = offerCode;

        // Save the updated booking
        await booking.save();

        // Respond with the updated booking details
        res.status(200).json({ message: 'Offer applied successfully', booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
