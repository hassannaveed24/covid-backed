const mongoose = require("mongoose");

// autoIncrement.initialize(mongoose.connection);

// const autoIncrement = AutoIncrementFactory(mongoose.connection);

const contact_Schema = mongoose.model(
  "contactList",
  new mongoose.Schema({
    name: { type: String, required: "Contact name is required" },
    type: {
      type: String,
      enum: ["Office", "Administrator", "Authority", "Subcontractor"],
      required: "Type is required"
    },
    phoneNumber: String, //landline number
    mobileNumber: String, //mobile number
    index: { type: Number, required: "Priority index is required" }
  })
);

module.exports = contact_Schema;
