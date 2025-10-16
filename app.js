const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const app = express();
const methodoverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send("Hi, I am root");
});

app.listen(3030, () => {
    console.log("Server is listening on port 3030");
});