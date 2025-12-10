const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    displayName: {
        type: String
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    watchlist: [{
        symbol: String,
        companyName: String,
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
module.exports = mongoose.model('User', userSchema);
