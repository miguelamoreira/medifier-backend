const mqttClient = require('../config/mqtt');

function publish(topic, message) {
    if (mqttClient.connected) {
        mqttClient.publish(topic, message, (err) => {
            if (err) {
                console.error(`Erro ao publicar no tópico ${topic}: `, err);
            } else {
                console.log(`Mensagem publicada no tópico ${topic}: ${message}`);
            }
        })
    } else {
        console.error('O cliente não está conectado. Mensagem não publicada.');
    }
}

function subscribe(topic) {
    if (mqttClient.connected) {
        mqttClient.subscribe(topic, (err) => {
            if (err) {
                console.error(`Erro ao subscrever o tópico ${topic}: `, err);
            } else {
                console.log(`Subscrição ao tópico ${topic} feita com sucesso`);
            }
        }) 
    } else {
        console.error('O cliente não está conectado. Subscrição não efetuada.');
    }
}

mqttClient.on('message', (topic, message) => {
    console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
});

module.exports = { publish, subscribe }