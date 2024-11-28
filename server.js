require('dotenv').config();
const express = require('express');
const db = require('./models/index')
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const mqttService = require('./services/mqttService');
const routes = require('./routes/index')

app.use('/medifier', routes);

// apenas para testar a conexão ao broker
app.post('/publish', (req, res) => {
    const { topic, message } = req.body;
    mqttService.publish(topic, message);
    res.status(200).send('Mensagem publicada')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
})