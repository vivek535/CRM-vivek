const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedback: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);