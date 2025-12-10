const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (phoneNumber, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your Zerodha OTP is: ${otp}. Valid for 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        return { success: true, messageSid: message.sid };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, error: error.message };
    }
};

const verifyOTP = (storedOTP, providedOTP, otpExpires) => {
    if (!storedOTP || !providedOTP) {
        return false;
    }
    
    if (new Date() > otpExpires) {
        return false;
    }
    
    return storedOTP === providedOTP;
};

module.exports = { generateOTP, sendOTP, verifyOTP };