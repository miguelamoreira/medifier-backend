const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');
const Notification = require('../models/notificationModel');
const Agenda = require('../models/agendaModel')

async function scheduleReminder(medicine, userId, scheduledDate) {
    const reminderInterval = 5 * 60 * 1000;
    const timeLimit = 30 * 60 * 1000;

    const checkStarTime = new Date(scheduledDate);

    const interval = setInterval(async() => {
        const touchState = subscribers.getTouchState();
        const weightState = subscribers.getWeightState();

        if (touchState || weightState) {
            clearInterval(interval);
            console.log('Medicação tomada.');
            return;
        }

        const currentTime = new Date();
        if (currentTime - checkStarTime > timeLimit) {
            clearInterval(interval);
            const missedNotification = `A medicação ${medicine} não foi tomada.`
            await Notification.create({ content: missedNotification, user: userId });
            publishers.publishUpdate({ content: missedNotification })
            return;
        }

        const reminderNotification = `Lembrete: ainda não tomou a medicação: ${medicine}`
        await Notification.create({ content: reminderNotification, user: userId });
        publishers.publishUpdate({ content: reminderNotification })
    }, reminderInterval)
}

exports.getNotifications = async (req, res) => {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId });

    return res.status(200).json({
        message: 'Notificações recuperadas com sucesso.',
        items: notifications
    });
};

exports.addNotificationItem = async (req, res) => {
    const {item} = req.body;
    const userId = req.user.id;

    if (!item  || !item.startDate || !item.endDate || !item.time || !item.medication) {
        return res.status(400).json({
            message: 'Dados incompletos'
        });
    };

    const medicine = item.medication;
    const scheduledDate = new Date(item.startDate);
    const scheduledTime = item.time.split(':')

    scheduledDate.setUTCHours(parseInt(scheduledTime[0]), parseInt(scheduledTime[1]), 0, 0);

    if (currentTime >= scheduledDate && currentTime <= new Date(item.endDate)) {
        const notificationContent = `Está na hora da sua medicação: ${medicine}`;
        await Notification.create({ content: notificationContent, user: userId });
        publishers.publishUpdate({ content: notificationContent }); 
    }

    scheduleReminder(medicine, userId, scheduledDate.toISOString());

    return res.status(200).json({
        message: 'Notificação enviada'
    })
}

