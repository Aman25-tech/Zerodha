const mongoose = require("mongoose");
const initData = require("./data.js");
const User = require('../models/user.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/zerodha";

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await User.deleteMany({});
    await User.insertMany(initData.data);
    console.log("Database initialized with sample data");
};

initDB();