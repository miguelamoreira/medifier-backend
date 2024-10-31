const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: false
})

module.exports = mongoose.model('Sensor', sensorSchema)