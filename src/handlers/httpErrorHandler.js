const UnauthorizedTokenError = require('../errors/UnauthorizedTokenError');
const LoginAlreadyExistsError = require('../errors/LoginAlreadyExistsError');
const DocumentAlreadyExistsError = require('../errors/DocumentAlreadyExistsError');

const handleError = (err, res) => {
    switch (err.name) {
        case LoginAlreadyExistsError.name:
        case DocumentAlreadyExistsError.name:
        case UnauthorizedTokenError.name:
            res.status(err.statusCode).json({ statusCode: err.statusCode, message: err.message });
            break;
        default:
            res.status(500).json({ statusCode: 500, message: "Ocorreu um erro no servidor!" });
            //enviar erros por email? slack? discord?
            break;
    }
};

module.exports = handleError