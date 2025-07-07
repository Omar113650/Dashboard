"use strict";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// Loads the .env file
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log("✅ MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
    }
};
module.exports = connectDB;
