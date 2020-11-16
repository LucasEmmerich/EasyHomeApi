const jwt = require('jsonwebtoken');
const UnauthorizedTokenError = require('../errors/UnauthorizedTokenError');
const config = require('../../package.json').config;

module.exports = {
    getUserInfoByToken: (token) => {
        return jwt.verify(token, config.jwtSecret, (err, user) => {
            if (err) throw new UnauthorizedTokenError("Token inválido!");
            return user;
        });
    },
    generateToken: (id, login, nome) => {
        return jwt.sign({ Id: id, Login: login, Name: nome }, config.jwtSecret, {
            expiresIn: 99999
        });
    }
}