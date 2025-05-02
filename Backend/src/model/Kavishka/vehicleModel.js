// model/Kavishka/vehicleModel.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    residentId: { type: String, required: true },
    name: { type: String, required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    vehicleType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);