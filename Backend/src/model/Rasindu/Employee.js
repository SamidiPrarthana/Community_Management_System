const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Admin', 'Security', 'Cleaners', 'Resident services', 'Maintenance'] },
    hourlyRate: { type: Number, required: true },
    photo: { type: String },
    employeeId: { type: String, unique: true },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
