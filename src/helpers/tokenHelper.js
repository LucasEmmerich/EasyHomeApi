const jwt = require('jsonwebtoken');
const config = require('../../package.json').config;

module.exports = {
    getUserInfoByToken: (token) => {
        return jwt.verify(token, config.jwtSecret, (err, user) => {
            if (err) throw new Error("Token inválido!");
            return user;
        });
    },
    generateToken: (id, login, nome) => {
        return jwt.sign({ Id: id, Login: login, Name: nome }, config.jwtSecret, {
            expiresIn: 99999
        });
    }
}