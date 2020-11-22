module.exports = class LoginAlreadyExistsError extends Error {
    constructor() {
        super('Login já existente!')
        this.name = 'LoginAlreadyExistsError'
        Error.captureStackTrace(this, this.constructor);
        this.isSleepy = true
    }
}