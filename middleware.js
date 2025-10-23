const isLoggedIn = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

const isLoggedOut = (req, res, next) => {
    if (req.session.user_id) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = { isLoggedIn, isLoggedOut };