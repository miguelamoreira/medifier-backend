const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    medication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agenda',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: false
})

module.exports = mongoose.model('History', historySchema)