require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const mqttService = require('./services/mqttService')

app.post('/publish', (req, res) => {
    const { topic, message } = req.body;
    mqttService.publish(topic, message);
    res.status(200).send('Mensagem publicada')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
})