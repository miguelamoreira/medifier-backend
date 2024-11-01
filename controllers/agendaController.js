const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');
const Agenda = require('../models/agendaModel')

exports.getAgenda = async (req, res) => {
    const userId = req.user.id;
    const agendaItems = await Agenda.find({ user: userId });

    return res.status(200).json({
        message: 'Agenda obtida com sucesso',
        agendaItems
    })
};

exports.addAgendaItem = async (req, res) => {
    const item = req.body;
    const userId = req.user.id;

    const time = new Date(item.time);

    if (!item || !item.medication || !item.time || !item.amount) {
        return res.status(400).json({
            message: 'Dados incompletos'
        });
    };

    const newAgendaItem = await Agenda.findOneAndUpdate(
        { user: userId },
        { $push: { items: { medication: item.medication, time, amount: item.amount } } },
        { new: true, upsert: true } 
    );

    publishers.publishUpdate(newAgendaItem);
    return res.status(200).json({
        message: 'Agenda atualizada',
        item: newAgendaItem
    });
}

exports.getAgendaItem = async (req, res) => {
    const { agendaId, itemId } = req.params;
    const userId = req.user.id;

    const agenda = await Agenda.findOne({
        _id: agendaId,
        user: userId
    });

    if (!agenda) {
        return res.status(404).json({
            message: 'A agenda não existe'
        })
    };

    const agendaItem = agenda.items.id(itemId);

    if (!agendaItem) {
        return res.status(404).json({
            message: 'A medicação não existe'
        })
    };

    return res.status(200).json({
        message: 'Medicação encontrada',
        item: agendaItem
    });
};

exports.updateAgendaItem = async (req, res) => {
    const { agendaId, itemId } = req.params;
    const newData = req.body;
    const userId = req.user.id;

    const agenda = await Agenda.findOne({
        _id: agendaId,
        user: userId
    });

    if (!agenda) {
        return res.status(404).json({
            message: 'A agenda não existe'
        })
    };
    
    const updatedAgenda = await Agenda.findOneAndUpdate(
        { _id: agendaId, user: userId, 'items._id': itemId }, 
        { $set: { 'items.$': { ...agenda.items.id(itemId)._doc, ...newData } } }, 
        { new: true } 
    );

    if (!updatedAgenda) {
        return res.status(404).json({
            message: 'A medicação não existe'
        })
    };

    const updatedAgendaItem = updatedAgenda.items.id(itemId);

    publishers.publishUpdate(updatedAgendaItem);
    return res.status(200).json({
        message: 'Medicação atualizada com sucesso.',
        item: updatedAgendaItem
    });
};

exports.deleteAgendaItem = async (req, res) => {
    const { agendaId, itemId } = req.params;
    const userId = req.user.id;

    const agenda = await Agenda.findOne({
        _id: agendaId,
        user: userId
    });

    if (!agenda) {
        return res.status(404).json({
            message: 'A agenda não existe'
        })
    };
    
    const deletedAgendaItem = agenda.items.id(itemId);

    if (!deletedAgendaItem) {
        return res.status(404).json({
            message: 'A medicação não existe'
        })
    };

    agenda.items.pull(itemId);
    await agenda.save();

    return res.status(204).json({});
};

