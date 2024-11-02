const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
    items: [{
        medication: String,
        startDate: Date,
        endDate: Date,
        time: String,
        amount: Number
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: false
})

module.exports = mongoose.model('Agenda', agendaSchema)