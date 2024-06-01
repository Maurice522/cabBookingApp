const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const otpService = require('../utils/otpService');

// Generate OTP
const generateOTP = () => {
    return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
};

// Signup
exports.signup = async (req, res) => {
    try {
        const { phoneNumber, name } = req.body;

        // Check if user already exists
        let existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        // Create a new user instance
        const newUser = new User({
            phoneNumber,
            otp,
            otpExpires,
            name
        });

        // Save the user to the database
        await newUser.save();

        // Send OTP via Twilio using otpService
        await otpService.sendOTP(phoneNumber, otp);

        // Respond with success message
        res.status(201).json({ message: 'User created successfully, OTP sent to your phone', userId: newUser._id });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        // Find the user by phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Validate OTP and expiry
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(401).json({ message: 'Invalid OTP or OTP expired' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with token
        res.status(200).json({ token });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
