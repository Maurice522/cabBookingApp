const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cancellability: {
        type: Boolean,
        required: true,
    },
    waitingTime: {
        type: Number,
        required: true,
    },
    extraKmFare: {
        type: Number,
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
