const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');
const Agenda = require('../models/agendaModel')

exports.getAgenda = async (req, res) => {
    const userId = req.user.id;
    const agendaItems = await Agenda.find({ user: userId });
    console.log(agendaItems);
    

    return res.status(200).json({
        message: 'Agenda obtida com sucesso',
        agendaItems
    })
};

exports.addAgendaItem = async (req, res) => {
    const { medication, startDate, endDate, times, frequency } = req.body;
    const userId = req.user.id;
  
    if (!medication || !startDate || !endDate || !times || !frequency) {
        return res.status(400).json({ message: 'Incomplete data' });
    }
  
    try {
        const agendaItem = {
            medication,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            frequency,
            items: times.map(time => ({
                time: time.time, // Expecting time as string
                amount: time.amount, // Expecting amount as string
            }))
        };
  
        const updatedAgenda = await Agenda.findOneAndUpdate(
            { user: userId },
            { $push: { items: agendaItem } },
            { new: true, upsert: true }
        );
        console.log(agendaItem);
        return res.status(200).json({ message: 'Agenda updated', item: agendaItem });
        
    } catch (error) {
        return res.status(500).json({ message: 'Error updating agenda', error: error.message });
    }
};

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

