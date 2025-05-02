const mongoose = require('mongoose');

const leavetimeSchema = new mongoose.Schema({

    departureTimes: { type: Map, of: String, required: true }, // Storing leave time per day
    availableDays: { type: [String], required: true },

});

module.exports = mongoose.model('leavetime', leavetimeSchema);
