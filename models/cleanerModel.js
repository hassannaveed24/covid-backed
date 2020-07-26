const mongoose = require("mongoose");

const cleaner_Schema = mongoose.model(
  "cleaningSecurity",
  new mongoose.Schema({
    fullName: { type: String, required: "Full Name is required" },
    email: { type: String, required: "Email is required" },
    role: {
      type: String,
      enum: ["Cleaning Team", "Security Team"],
      required: "Role is required"
    },
    phoneNumber: { type: String, required: "Contact number is required" }
  })
);

module.exports = cleaner_Schema;
