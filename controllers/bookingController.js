const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Driver = require('../models/driverModel');

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(accountSid, authToken); commented due to no working twilio account

// Function to send SMS via Twilio
const sendSMS = async (phone, message) => {
    try {
        // await client.messages.create({
        //     body: message,
        //     from: twilioPhoneNumber,
        //     to: phone
        // });
        console.log(`SMS sent to ${phone}: ${message}`);
    } catch (error) {
        console.error(`Failed to send SMS to ${phone}: ${error.message}`);
        throw new Error('Failed to send SMS');
    }
};

// Controller function to book a cab
exports.bookCab = async (req, res) => {
    try {
        const { userId, driverId, pickupLocation, dropoffLocation, fare } = req.body;

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate driver
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Create a new booking
        const booking = new Booking({
            user: userId,
            driver: driverId,
            pickupLocation,
            dropoffLocation,
            fare
        });

        try {
            // Save the booking to the database
            await booking.save();
        
            // Update driver's booking history
            driver.bookingHistory.push(booking._id);
            await driver.save();
        
            // Notify driver via SMS (if implemented)
            const messageText = `New booking from ${pickupLocation} to ${dropoffLocation}. Fare: ${fare}`;
            await sendSMS(driver.phone, messageText); 
        
            // Respond with the booking details
            return res.status(201).json({ message: 'Booking created successfully', booking });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller function to get booking history of a user
exports.getBookingHistory = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming userId is stored in req.user._id after authentication

        // Find bookings for the user
        const bookings = await Booking.find({ user: userId }).populate('driver');

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
