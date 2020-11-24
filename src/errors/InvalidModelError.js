const InvalidModelError = class extends Error {
    constructor(){
        super('O Objeto não passou pelas validações da API.');
        this.name = 'InvalidModelError',
        this.statusCode = 400,
        Error.captureStackTrace(this, this.constructor);
        this.isSleepy = true
    }
}

module.exports = InvalidModelError