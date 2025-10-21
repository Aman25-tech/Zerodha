const express = require('express');
const router = express.Router();

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