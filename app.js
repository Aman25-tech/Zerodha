require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const passport = require('./config/passport');
const userRoutes = require('./routes/user');

const app = express();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zerodha');
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

connectDB();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/zerodha',
        touchAfter: 24 * 3600
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', userRoutes);

app.get('/favicon.ico', (req, res) => {
    res.sendStatus(204);
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { error: 'Something went wrong!' });
});

app.use((req, res) => {
    console.log('404 - Not Found:', req.url);
    res.status(404).render('error', { error: 'Page not found' });
});

app.listen(process.env.PORT || 3030, () => {
    console.log(`Server is running on port ${process.env.PORT || 3030}`);
});