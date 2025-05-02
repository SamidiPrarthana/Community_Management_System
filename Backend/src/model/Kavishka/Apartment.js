const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    apartmentNo: String,
    floor: String,
    block: String,
});

module.exports = mongoose.model("Apartment", apartmentSchema);
