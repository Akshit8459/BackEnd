const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 16,
        required: true,
        max: 100
    },
    phone: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
