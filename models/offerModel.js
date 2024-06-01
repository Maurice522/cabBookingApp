const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    conditions: {
        newUser: {
            type: Boolean,
            default: false
        },
        minCabPrice: {
            type: Number,
            default: 0
        },
        cabType: {
            type: String,
            default: null
        }
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
