const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');

exports.getAgenda = async (req, res) => {

};

exports.addAgendaItem = async (req, res) => {
    const item = req.body;

    if (!item || !item.date || !item.time || !item.medicine) {
        return res.status(400).json({
            message: 'Dados incompletos'
        });
    };

    publishers.publishUpdate(item);
    return res.status(200).json({
        message: 'Agenda atualizada',
        item
    });
}

exports.getAgendaItem = async (req, res) => {
    
};

exports.updateAgendaItem = async (req, res) => {

};

exports.deleteAgendaItem = async (req, res) => {

};

