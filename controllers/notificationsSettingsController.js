const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');
const NotificationsSettings = require('../models/notificationsSettingsModel')

exports.getNotificationSettings = async (req, res) => {
    const userId = req.user.id;

    try {
        let settings = await NotificationsSettings.findOne({ user: userId });
        
        if (!settings) {
            settings = await NotificationsSettings.create({ user: userId });
        }

        res.status(200).json({ settings });
    } catch (error) {
        console.error('Error fetching notification settings:', error);
        res.status(500).json({ message: 'Failed to fetch notification settings' });
    }
};

exports.updateNotificationSettings = async (req, res) => {
    const userId = req.user.id;
    const { medicationReminders, missedDoseAlerts } = req.body;

    try {
        const updatedSettings = await NotificationsSettings.findOneAndUpdate(
            { user: userId },
            { medicationReminders, missedDoseAlerts },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Notification settings updated successfully',
            settings: updatedSettings,
        });
    } catch (error) {
        console.error('Error updating notification settings:', error);
        res.status(500).json({ message: 'Failed to update notification settings' });
    }
};
