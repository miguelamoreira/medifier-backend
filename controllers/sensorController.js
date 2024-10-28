const publishers = require('../publishers/publishers')
const subscribers = require('../subscribers/subscribers');


exports.getTouchState = (req, res) => {
    const { state } = subscribers.getTouchState();

    return res.status(200).json({
        sensor: 'touch',
        state
    });
}

exports.updateTouchState = (req, res) => {
    const { state } = req.body;

    if (!state) {
        return res.status(400).json({
            message: 'Estado inválido'
        });
    };

    publishers.publishTouchState(state);
    return res.status(200).json({
        message: 'Estado do sensor de toque atualizado'
    });
}

exports.getWeightState = (req, res) => {
    const { state } = subscribers.getWeightState();

    return res.status(200).json({
        sensor: 'weight',
        state
    });
}

exports.updateWeightState = (req, res) => {
    const { state } = req.body;

    if (!state) {
        return res.status(400).json({
            message: 'Estado inválido'
        });
    };

    publishers.publishWeightState(state);
    return res.status(200).json({
        message: 'Estado do sensor de peso atualizado'
    });
}


