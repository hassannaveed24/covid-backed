const mongoose = require('mongoose');

const potentialPatient_Schema = mongoose.model('potentialPatient', new mongoose.Schema({
    imageURL: String,
    floor: String,
    location: {
        top: String,
        right: String
    },
    timestamp: {
        type: Date,
        default: new Date
    },
    locationName: String,
    readings: {
        thermometer: String,
        oxymeter: String
    },
    user_id: String,


}));

module.exports = potentialPatient_Schema;
