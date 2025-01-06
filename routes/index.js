const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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

router.route('/users/:userId')
    .patch(authMiddleware, userController.updateUser)
    .delete(authMiddleware, userController.deleteUser)

router.route('/users/:userId/avatar')
    .post(authMiddleware, upload.single('avatar') , userController.updateAvatar)

router.route('/login')
    .post(userController.login)

router.route('/notifications')
    .get(authMiddleware, notificationController.getNotifications)
    .post(authMiddleware, notificationController.addNotificationItem)

router.route('/history')
    .get(authMiddleware, historyController.getHistoryByUser)
    .post(historyController.addHistory)

module.exports = router;