const mongoose = require('mongoose'),
    config = require("../config/config"),
    Schema = mongoose.Schema;

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
    status: { type: String, enum: ["new", "open", "close"], default: "new" },
    triggerAt: Date,
    closedAt: Date,
    agent_id: {
        type: Schema.ObjectId,
        ref: 'User'
    }
}));

module.exports = ticket;
