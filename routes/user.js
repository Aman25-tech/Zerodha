const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isLoggedOut } = require('../middleware.js');
const User = require('../models/user');
const { generateOTP, sendOTP, verifyOTP } = require('../services/otpService');

router.get('/', (req, res) => {
    res.render('users/index');
});

router.get('/signup', isLoggedOut, (req, res) => {
    try {
        res.render('users/signup');
    } catch (error) {
        console.error('Error rendering signup:', error);
        next(error);
    }
});

router.post('/signup', isLoggedOut, async (req, res) => {
    try {
        const { email, password, mobile } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            req.flash('error', 'Email or mobile already registered');
            return res.redirect('/signup');
        }
        
        const user = new User({ email, mobile });
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash('error', 'Error during login');
                return res.redirect('/signup');
            }
            req.flash('success', 'Welcome to Zerodha! Please verify your phone');
            res.redirect('/send-otp');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
});

router.get('/send-otp', isLoggedIn, (req, res) => {
    try {
        res.render('users/send-otp');
    } catch (error) {
        console.error('Error rendering send-otp:', error);
        next(error);
    }
});

router.post('/send-otp', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user.isPhoneVerified) {
            req.flash('success', 'Phone already verified');
            return res.redirect('/dashboard');
        }
        
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        
        const result = await sendOTP(user.mobile, otp);
        
        if (result.success) {
            req.flash('success', `OTP sent to ${user.mobile}`);
            res.redirect('/verify-otp');
        } else {
            req.flash('error', 'Failed to send OTP. Try again.');
            res.redirect('/send-otp');
        }
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/send-otp');
    }
});

router.get('/verify-otp', isLoggedIn, (req, res) => {
    try {
        res.render('users/verify-otp');
    } catch (error) {
        console.error('Error rendering verify-otp:', error);
        next(error);
    }
});

router.post('/verify-otp', isLoggedIn, passport.authenticate('otp', {
    failureFlash: true,
    failureRedirect: '/verify-otp'
}), (req, res) => {
    req.flash('success', 'Phone verified successfully!');
    res.redirect('/dashboard');
});

router.get('/login', isLoggedOut, (req, res) => {
    try {
        res.render('users/login');
    } catch (error) {
        console.error('Error rendering login:', error);
        next(error);
    }
});

router.post('/login', isLoggedOut, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/dashboard');
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Successfully logged in with Google!');
    res.redirect('/dashboard');
});

router.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render('users/dashboard', { user });
    } catch (error) {
        req.flash('error', 'Unable to load dashboard');
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/');
    });
});

router.get('/pricing', (req, res) => {
    try {
        res.render('users/pricing');
    } catch (error) {
        console.error('Error rendering pricing:', error);
        next(error);
    }
});

router.get('/about', (req, res) => {
    try {
        res.render('users/about');
    } catch (error) {
        console.error('Error rendering about:', error);
        next(error);
    }
});

module.exports = router;