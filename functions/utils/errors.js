const apiErrorType = {
    auth: {
        noTokenProvided: 'NO_TOKEN_PROVIDED',
        tokenInvalidOrExpired: 'TOKEN_INVALID_OR_EXPIRED'
    },
    server: {
        internalServerError: 'INTERNAL_SERVER_ERROR'
    },
    badRequest: {
        noContentTypeHeader: 'NO_CONTENT_TYPE_HEADER',
        noFileProvided: 'NO_FILE_PROVIDED'
    }
}

class ApiError {
    type = null
    status = null

    constructor(type) {
        this.type = type
    }
}

class AuthError extends ApiError {
    constructor(type) {
        super(type)
        this.status = 401
    }
}

class ServerError extends ApiError {
    constructor() {
        super(apiErrorType.server.internalServerError)
        this.status = 500
    }
}

class BadRequestError extends ApiError {
    constructor(type) {
        super(type)
        this.status = 400
    }
}

const handleApiError = (error, res) => {
    if (error instanceof ApiError) {
        return res.status(error.status).json({ error })
    }
    sendServerError(res)
}

const sendServerError = (res) => {
    const error = new ServerError()
    res.status(error.status).json({ error })
}

module.exports = { handleApiError, AuthError, ServerError, BadRequestError, apiErrorType }
