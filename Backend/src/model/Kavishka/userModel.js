const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Full name is required']
        },

        userType: {
            type: String,
            enum: ["Resident", "Visitor", "Staff", "Admin"],
            required: true
        },

        phoneNumber: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        // Optional field to store last login time (for analytics or auditing)
        lastLogin: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
