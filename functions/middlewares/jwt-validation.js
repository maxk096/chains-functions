const { AuthError, apiErrorType, handleApiError } = require('../utils/errors')
const AuthAdmin = require('../models/auth-admin')

const JwtValidationMiddleware = async (req, res, next) => {
    try {
        const idToken = req.headers.token
        if (!idToken) {
            throw new AuthError(apiErrorType.auth.noTokenProvided)
        }

        req.tokenPayload = await AuthAdmin.verifyIdToken(idToken)
        next()
    } catch (ex) {
        handleApiError(ex, res)
    }
}

module.exports = JwtValidationMiddleware