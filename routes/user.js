const express = require('express');
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require('../middleware.js');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('users/index');
});

router.get('/signup', (req, res) => {
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
        const user = new User({ email, mobile });
        const registeredUser = await User.register(user, password);
        req.session.user_id = registeredUser._id;
        req.flash('success', 'Welcome to Zerodha!');
        res.redirect('/dashboard');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
});

router.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.user_id);
        res.render('users/dashboard', { user });
    } catch (error) {
        req.flash('error', 'Unable to load dashboard');
        res.redirect('/');
    }
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