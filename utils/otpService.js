const twilio = require('twilio');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(accountSid, authToken); commented due to no working twilio account

// Function to send OTP via SMS
exports.sendOTP = async (phoneNumber, otp) => {
    try {
        // // Construct the SMS message

        // const message = await client.messages.create({
        //     body: `Your OTP code is ${otp}`,
        //     from: twilioPhoneNumber,
        //     to: phoneNumber
        // });


        console.log(`OTP sent to ${phoneNumber}: ${otp}`);
    } catch (error) {
        console.error('Error sending OTP via Twilio:', error);
        throw new Error('Error sending OTP');
    }
};
