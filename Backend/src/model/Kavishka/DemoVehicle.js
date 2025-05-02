const mongoose = require('mongoose');

const DemoVehicleSchema = new mongoose.Schema({
    slot: Number,
    vehicleNumber: String,
    vehicleType: String,
    entryTime: String,
    leavingTime: String,
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('DemoVehicle', DemoVehicleSchema);
