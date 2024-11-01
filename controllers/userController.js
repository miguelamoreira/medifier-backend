const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: 'Utilizador não encontrado'
        })
    }

    const check = bcrypt.compareSync(password.trim(), user.password);
        
    if (!check) {
        return res.status(401).json({ 
            message: 'Credenciais inválidas' 
        });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ 
        message: 'Login feito com sucesso', 
        token 
    });
};

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({
            message: 'Dados incompletos'
        })
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({
            message: `O username ${username} já está a ser utilizado`
        })
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({
            message: `O e-mail ${email} já está a ser utilizado`
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword, email });
    return res.status(201).json({
        message: 'Utilizador criado com sucesso'
    })
}