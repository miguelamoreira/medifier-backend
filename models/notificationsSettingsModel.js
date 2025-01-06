const mongoose = require('mongoose');

const notificationsSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    medicationReminders: { 
        type: Boolean, 
        default: true 
    },
    missedDoseAlerts: { 
        type: Boolean, default: true 
    },
}, {
    timestamps: false
});

module.exports = mongoose.model('NotificationsSettings', notificationsSettingsSchema);
