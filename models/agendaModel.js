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
    selectedDays: {
      type: [Number],  // Array of numbers (0-6) to represent days of the week
      required: function() {
        return this.frequency === "On specific days of the week";
      },
      validate: {
        validator: function(v) {
          // Ensure the days are valid numbers (0-6) representing Sunday-Saturday
          return v.every(day => day >= 0 && day <= 6);
        },
        message: props => `${props.value} is not a valid day of the week!`
      },
    },
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
