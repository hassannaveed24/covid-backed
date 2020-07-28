const mongoose = require('mongoose');
const config = require("../config/config");

const ticket = mongoose.model('ticket', new mongoose.Schema({
    imageURL: String,
    floor: String,
    location: {
        top: String,
        right: String
    },
    timestamp: {
        type: Date,
        default: new Date()
    },
    locationName: String,
    readings: {
        thermometer: String,
        oxymeter: String
    },
    user_id: String,
    ticketId: String,
    Property: { type: String, default: config.propertyDetails.PropertyName },
    status: { type: String, enum: ["new", "openned", "close"], default: "new" }
}));

module.exports = ticket;
