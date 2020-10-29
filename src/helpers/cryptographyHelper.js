const crypto = require('crypto');
const config = require('../../package.json').config;

module.exports = {
    encryptPassword: (passwd) => {
        return crypto.createHmac('sha256', config.jwtSecret).update(passwd).digest('hex');
    },
    verifyPassword: (passwd, hash) => {
        return crypto.createHmac('sha256', config.jwtSecret).update(passwd).digest('hex') === hash;
    }
}