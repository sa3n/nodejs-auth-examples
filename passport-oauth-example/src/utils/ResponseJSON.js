class SuccessResponseJSON  {
    constructor (data) {
        this.data = data
        this.error = null
    }
}

class ErrorResponseJSON {
    constructor (errorCode, errorMessage) {
        this.error = {
            code: errorCode,
            message: errorMessage
        }
        this.data = null
    }
}

module.exports = {
    SuccessResponseJSON,
    ErrorResponseJSON
}
