const mqttService = require('../services/mqttService');

let touchState = null;
let weightState = null;

function processSensorState(data) {
    const { sensor, state } = data;

    if (sensor === 'touch') {
        touchState = state;
    } else if (sensor === 'weight') {
        weightState = state;
    }

    console.log(`Estado do sensor ${sensor} recebido: ${state}`);
}

function processUpdate(item) {
    console.log('Atualização da agenda recebida:', item);
}

function getTouchState() {
    return touchState
}

function getWeightState() {
    return weightState
}

mqttService.mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());

    if (topic === 'Estado sensores') {
        processSensorState(data);
    } else if (topic === 'Agenda') {
        processUpdate(data);
    }
})

module.exports = {
    getTouchState,
    getWeightState
}