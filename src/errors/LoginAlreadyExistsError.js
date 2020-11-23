module.exports = class LoginAlreadyExistsError extends Error {
    constructor() {
        super('Nome de usuário já existente!')
        this.name = 'LoginAlreadyExistsError'
        Error.captureStackTrace(this, this.constructor);
        this.isSleepy = true
    }
}