const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    fullName: { type: String, required: "Full Name is required" },
    email: { type: String, required: "Email is required" },
    password: { type: String, required: "Password is required" },
    role: {
        type: String,
        enum: ["PM", "SM", "EM"],
        required: "Role is required"
    },
    phoneNumber: { type: String, required: "Contact Number is required" },
}));

module.exports = User;
