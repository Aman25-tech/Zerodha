const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const User = require("./models/user");

const userRoutes = require('./routes/user');

const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/zerodha";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

main();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
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