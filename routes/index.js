const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController')

router.route('/sensor/touch')
    .get(sensorController.getTouchState)
    .post(sensorController.updateTouchState)

router.route('/sensor/weight')
    .get(sensorController.getWeightState)
    .post(sensorController.updateWeightState)

// POST - rota para atualizar a agenda
router.post('/agenda', (req, res) => {
    const item = req.body;

    if (!item || !item.date || !item.time || !item.medicine) {
        return res.status(400).json({
            message: 'Dados incompletos'
        })
    }

    publishers.publishUpdate(item);
    return res.status(200).json({
        message: 'Agenda atualizada',
        item
    })
});

// faltam rotas de autenticação, o resto das rotas da agenda (get, get de um registo pelo id, alteração de um registo pelo id, apagar um registo pelo id)
// get do histórico e as rotas das notificações (??)

module.exports = router;