const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slotNumber: Number,
    status: { type: String, default: 'free' },
});

module.exports = mongoose.model('Slot', slotSchema);