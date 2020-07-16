const mongoose = require('mongoose');

const Test = mongoose.model('Test', new mongoose.Schema({
    testId: String,
    testName: String
}));

exports.Test = Test;