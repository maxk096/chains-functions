const admin = require('firebase-admin')
const { AuthError, apiErrorType } = require('../utils/errors')
admin.initializeApp()

class AuthAdmin {
    static async verifyIdToken(idToken, checkIfExpired) {
        try {
            return await admin.auth().verifyIdToken(idToken, checkIfExpired)
        } catch (ex) {
            throw new AuthError(apiErrorType.auth.tokenInvalidOrExpired)
        }
    }
}

module.exports = AuthAdmin