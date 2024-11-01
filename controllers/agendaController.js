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

    if (!item || !item.medication || !item.time || !item.amount) {
        return res.status(400).json({
            message: 'Dados incompletos'
        });
    };

    const newAgendaItem = new Agenda({
        medication: item.medication,
        time: item.time,
        amount: item.amount,
        user: userId
    })
    await newAgendaItem.save();

    publishers.publishUpdate(newAgendaItem);
    return res.status(200).json({
        message: 'Agenda atualizada',
        item: newAgendaItem
    });
}

exports.getAgendaItem = async (req, res) => {
    const { itemId } = req.params;
    const agendaItem = await Agenda.findById(itemId);

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
    const { itemId } = req.params;
    const newData = req.body;
    
    const updatedAgendaItem = await Agenda.findByIdAndUpdate(id, newData, { new: true });

    if (!updatedAgendaItem) {
        return res.status(404).json({
            message: 'A medicação não existe'
        })
    };

    publishers.publishUpdate(updatedAgendaItem);
    return res.status(200).json({
        message: 'Medicação atualizada com sucesso.',
        item: updatedAgendaItem
    });
};

exports.deleteAgendaItem = async (req, res) => {
    const { itemId } = req.params;
    
    const deletedAgendaItem = await Agenda.findByIdAndDelete(itemId);

    if (!deletedAgendaItem) {
        return res.status(404).json({
            message: 'A medicação não existe'
        })
    };

    return res.status(204).json({});
};

