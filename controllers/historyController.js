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
    const { medicationName } = req.body;
    const userId = req.user.id;
    const date = new Date();
    let message;

    const agendaItem = await Agenda.findOne({ user: userId, 'items.medication': medicationName });

    if (!agendaItem) {
        return res.status(404).json({
            message: 'Medicação não encontrada na agenda.'
        });
    }

    const touchState = subscribers.getTouchState();
    const weightState = subscribers.getWeightState();
    
    if (touchState || weightState) {
        message = `A medicação ${medicationName} foi tomada.`
    } else {
        message = `A medicação ${medicationName} não foi tomada.`
    }

    const historyItem = new History({
        date: date,
        medication: medicationName, 
        user: userId,
        message: message,
    });
    await historyItem.save();

    publishers.publishUpdate(historyItem);
    return res.status(200).json({
        message: 'Mensagem adicionada ao histórico com sucesso.',
        historyItem
    });
}

