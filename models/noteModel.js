const mongoose = require('mongoose'),
    config = require("../config/config"),
    Schema = mongoose.Schema;

const note_Schema = mongoose.model('notes', new mongoose.Schema({
    ticketId: {
        type: Schema.ObjectId,
        ref: 'ticket',
        required: 'Ticket Reference is required'
    },
    userId: { //who is saving this details
        type: Schema.ObjectId,
        ref: 'User',
        required: 'Agent Reference is required'
    },
    timestamp: { type: Date, default: Date() },
    contact: { type: String, required: "Contact number is required (to whom you are calling)" },
    Property: { type: String, default: config.propertyDetails.PropertyName },
    response: { type: String, required: "Call response is required" }

}));

module.exports = note_Schema;
