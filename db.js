const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = "mongodb://localhost:27017/ChatApp"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo");
    });
}

module.exports = connectToMongo;
