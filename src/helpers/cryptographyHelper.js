const crypto = require('crypto');
const config = require('../../package.json').config;

module.exports = {
    encryptPasswd: (passwd) => {
        return crypto.createHmac('sha256', config.jwtSecret).update(passwd).digest('hex');
    },
    verifyPasswd: (passwd, hash) => {
        return crypto.createHmac('sha256', config.jwtSecret).update(passwd).digest('hex') === hash;
    }
}