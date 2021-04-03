const functions = require('firebase-functions')

process.env.GOOGLE_APPLICATION_CREDENTIALS = functions.config().google.credentials
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()

const express = require('express')
const cors = require('cors')
const app = express()

const busboyMiddleware = require('./middlewares/busboy')
const JwtValidationMiddleware = require('./middlewares/jwt-validation')
const { BadRequestError, apiErrorType, handleApiError } = require('./utils/errors')

app.use(cors({ origin: true }))

app.post('/', JwtValidationMiddleware, busboyMiddleware, async (req, res) => {
    try {
        const [file] = req.files
        if (!file) {
            throw new BadRequestError(apiErrorType.badRequest.noFileProvided)
        }

        const fullResult = await client.documentTextDetection(file.buffer)
        const text = fullResult[0].fullTextAnnotation ? fullResult[0].fullTextAnnotation.text : ''
        res.status(200).json({ text })
    } catch (ex) {
        handleApiError(ex, res)
    }
})

exports.decodeFileText = functions.https.onRequest(app)
