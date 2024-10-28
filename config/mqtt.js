const mqtt = require('mqtt');

const brokerUrl = process.env.MQTT_BROKER_URL;
const options = {
    port: parseInt(process.env.MQTT_PORT, 10),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    protocol: 'mqtts',
}

const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
    console.log('Conectado ao broker MQTT da HiveMQ');
})

client.on('error', (error) => {
    console.error('Erro ao conectar ao broker MQTT: ', error);
});

module.exports = client;