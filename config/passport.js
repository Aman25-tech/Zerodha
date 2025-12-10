const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const GoogleStrategy = require('passport-google-oidc');
const User = require('../models/user');
const { verifyOTP } = require('../services/otpService');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, User.authenticate()));

passport.use('otp', new CustomStrategy(async (req, done) => {
    try {
        const { mobile, otp } = req.body;
        
        if (!mobile || !otp) {
            return done(null, false, { message: 'Mobile and OTP required' });
        }
        
        const user = await User.findOne({ mobile });
        
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        
        const isOtpValid = verifyOTP(user.otp, otp, user.otpExpires);
        
        if (!isOtpValid) {
            return done(null, false, { message: 'Invalid or expired OTP' });
        }
        
        user.otp = null;
        user.otpExpires = null;
        user.isPhoneVerified = true;
        await user.save();
        
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
}, async (issuer, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            return done(null, user);
        }
        
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
            user.googleId = profile.id;
            if (!user.displayName) {
                user.displayName = profile.displayName;
            }
            await user.save();
            return done(null, user);
        }
        
        const newUser = new User({
            email: profile.emails[0].value,
            googleId: profile.id,
            displayName: profile.displayName,
            isPhoneVerified: false
        });
        
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;