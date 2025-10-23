require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const userRoutes = require('./routes/user');

const app = express();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/zerodha', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
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
        mongoUrl: 'mongodb://localhost:27017/zerodha',
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

app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user_id;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { error: 'Something went wrong!' });
});

app.use((req, res) => {
    console.log('404 - Not Found:', req.url);
    res.status(404).render('error', { error: 'Page not found' });
});

app.listen(3030, () => {
    console.log("Server is running on port 3030");
});