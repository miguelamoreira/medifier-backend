const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');

exports.getNotifications = async (req, res) => {

};

exports.addNotificationItem = async (req, res) => {
    const item = req.body;

    if (!item || !item.date || !item.time || !item.medicine) {
        return res.status(400).json({
            message: 'Dados incompletos'
        });
    };

    publishers.publishUpdate(item);
    return res.status(200).json({
        message: 'Notificação atualizada',
        item
    });
}

