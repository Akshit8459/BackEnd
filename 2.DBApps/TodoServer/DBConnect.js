const mongoose = require('mongoose');
require('dotenv').config();

const connector = async () => {
    try {
        await mongoose.connect(process.env.DBURL); 
        console.log("Connected to DB Successfully");
    } catch (e) {
        console.log(`error while connecting to DB: ${e}`);
    }
};

module.exports = connector;
