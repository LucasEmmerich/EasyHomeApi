module.exports = class DocumentAlreadyExistsError extends Error {
    constructor() {
        super('Documento já registrado!')
        this.name = 'DocumentAlreadyExistsError'
        this.statusCode = 400;
        Error.captureStackTrace(this, this.constructor);
        this.isSleepy = true
    }
}