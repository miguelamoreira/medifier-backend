const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
  items: [{
    medication: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    times: [{
      time: { type: String, required: true },
      amount: { type: String, required: true },
    }],
    frequency: { type: String, required: true },
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: false,
});

module.exports = mongoose.model('Agenda', agendaSchema);
