const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController')
const agendaController = require('../controllers/agendaController')
const notificationController = require('../controllers/notificationController')
const historyController = require('../controllers/historyController')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

router.route('/sensor/touch')
    .get(sensorController.getTouchState)
    .post(sensorController.updateTouchState)

router.route('/sensor/weight')
    .get(sensorController.getWeightState)
    .post(sensorController.updateWeightState)

router.route('/agenda')
    .post(authMiddleware, agendaController.addAgendaItem)
    .get(authMiddleware, agendaController.getAgenda)

router.route('/agenda/:agendaId/items/:itemId')
    .get(authMiddleware, agendaController.getAgendaItem)
    .patch(authMiddleware, agendaController.updateAgendaItem)
    .delete(authMiddleware, agendaController.deleteAgendaItem)

router.route('/users')
    .post(userController.register)

router.route('/login')
    .post(userController.login)

router.route('/notification')
    .get(notificationController.getNotifications)
    .post(notificationController.addNotificationItem)

router.route('/history')
    .post(historyController.addHistory)

router.route('/history/:id')
    .get(historyController.getHistorybyUser)

module.exports = router;