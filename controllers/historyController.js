const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');
const History = require('../models/historyModel')

exports.getHistoryByUser = async (req, res) => {
    const userId = req.user.id;

    const historyItems = await History.find({ user: userId });

    return res.status(200).json({
        message: 'Histórico recuperado com sucesso.',
        items: historyItems
    });
};

exports.addHistory = async (req, res) => {
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

