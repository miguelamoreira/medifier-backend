const mqttService = require('../services/mqttService');

mqttService.subscribe('Estado sensores');
mqttService.subscribe('Agenda');

function processSensorState(data) {
    const { sensor, state } = data;
    console.log(`Estado do sensor ${sensor} recebido: ${state}`);
}

function processUpdate(item) {
    console.log('Atualização da agenda recebida:', item);
}

mqttService.mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());

    if (topic === 'Estado sensores') {
        processSensorState(data);
    } else if (topic === 'Agenda') {
        processUpdate(data);
    }
})
