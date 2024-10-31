const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
    items: [{
        medication: String,
        time: Number,
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