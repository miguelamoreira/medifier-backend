const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController')
const agendaController = require('../controllers/agendaController')
const notificationController = require('../controllers/notificationController')

router.route('/sensor/touch')
    .get(sensorController.getTouchState)
    .post(sensorController.updateTouchState)

router.route('/sensor/weight')
    .get(sensorController.getWeightState)
    .post(sensorController.updateWeightState)

router.route('/agenda')
    .post(agendaController.addAgendaItem)
    .get(agendaController.getAgenda)

router.route('/agenda/:id')
    .get(agendaController.getAgendaItem)
    .patch(agendaController.updateAgendaItem)
    .delete(agendaController.deleteAgendaItem)


router.route('/notification')
    .get(notificationController.getNotifications)
    .post(notificationController.addNotificationItem)
// get do histórico e as rotas das notificações (??)

module.exports = router;