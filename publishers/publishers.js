const mqttService = require('../services/mqttService');

function publishTouchState(state) {
    const message = JSON.stringify({
        sensor: 'touch',
        state: state
    });

    mqttService.publish('Estado sensores', message);
}

function publishWeightState(state) {
    const message = JSON.stringify({
        sensor: 'weight',
        state: state
    });

    mqttService.publish('Estado sensores', message);
}

function publishUpdate(item) {
    const message = JSON.stringify(item);
    mqttService.publish('Agenda', message);
}

module.exports = {
    publishTouchState,
    publishWeightState,
    publishUpdate
}

