module.exports = class UnauthorizedTokenError extends Error {
    constructor(message) {
        super(message)
        this.name = 'UnauthorizedTokenError'
        Error.captureStackTrace(this, this.constructor);
        this.isSleepy = true
    }
}