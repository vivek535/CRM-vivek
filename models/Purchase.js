const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    caratType: { type: String, required: true },
    hallmarkNumber: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Purchase', purchaseSchema);