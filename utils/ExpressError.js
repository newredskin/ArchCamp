class ExpressError extends Error {
    // Built-in Error object use params of "message" and "statusCode" -> keep the same names
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;