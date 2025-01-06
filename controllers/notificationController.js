const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');
const Notification = require('../models/notificationModel');
const Agenda = require('../models/agendaModel')

async function scheduleReminder(medicine, userId, scheduledDate) {
    const reminderInterval = 5 * 60 * 1000;
    const timeLimit = 30 * 60 * 1000;

    const checkStartTime = new Date(scheduledDate);

    const interval = setInterval(async() => {
        const touchState = subscribers.getTouchState();
        const weightState = subscribers.getWeightState();

        if (touchState || weightState) {
            clearInterval(interval);
            console.log('Medicação tomada.');
            return;
        }

        const currentTime = new Date();
        if (currentTime - checkStartTime > timeLimit) {
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
    const { item } = req.body;
    const userId = req.user.id;

    if (!item || !item.startDate || !item.endDate || !item.time || !item.medication) {
        return res.status(400).json({
            message: 'Dados incompletos'
        });
    }

    const medicine = item.medication;
    const scheduledDate = new Date(item.startDate);
    const scheduledTime = item.time.split(':');
    scheduledDate.setUTCHours(parseInt(scheduledTime[0]), parseInt(scheduledTime[1]), 0, 0);

    const currentTime = new Date();

    if (currentTime >= scheduledDate && currentTime <= new Date(item.endDate)) {
        const reminderNotificationContent = `It's time to take your medication: ${medicine}`;
        
        try {
            const reminderNotification = await Notification.create({
                content: reminderNotificationContent,
                user: userId,
                time: scheduledDate,
                type: 'reminder'
            });
            console.log('Reminder Notification criada:', reminderNotification);
            publishers.publishUpdate({ content: reminderNotificationContent });

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao criar a notificação de lembrete',
                error: error.message
            });
        }
    } 

    const timeLimit = 30 * 60 * 1000;
    const missedDoseNotificationTime = new Date(scheduledDate.getTime() + timeLimit);

    if (currentTime > missedDoseNotificationTime && currentTime <= new Date(item.endDate)) {
        const missedDoseNotificationContent = `You missed a dose of ${medicine}. Take it as soon as possible.`;
        
        try {
            const missedDoseNotification = await Notification.create({
                content: missedDoseNotificationContent,
                user: userId,
                time: new Date(),
                type: 'missed alert'
            });
            console.log('Missed Dose Notification criada :', missedDoseNotification);
            publishers.publishUpdate({ content: missedDoseNotificationContent });
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao criar a notificação de dose perdida',
                error: error.message
            });
        }
    }

    scheduleReminder(medicine, userId, scheduledDate.toISOString());

    return res.status(200).json({
        message: 'Notificação(s) enviada(s)'
    });
};