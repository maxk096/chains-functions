const Busboy = require('busboy')
const { ServerError, BadRequestError, apiErrorType, handleApiError } = require('../utils/errors')

const busboyMiddleware = (req, res, next) => {
    try {
        if (!req.headers['content-type']) {
            throw new BadRequestError(apiErrorType.badRequest.noContentTypeHeader)
        }

        const busboy = new Busboy({ headers: req.headers })
        req.files = []

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const fileBuffers = []

            file.on('data', (data) => {
                fileBuffers.push(data)
            })

            file.on('end', () => {
                const buffer = Buffer.concat(fileBuffers)
                req.files.push({
                    filename,
                    buffer,
                    fieldname,
                    encoding,
                    mimetype
                })
            })
        })

        busboy.on('finish', async () => {
            next()
        })

        busboy.on('error', () => {
            throw new ServerError()
        })

        busboy.end(req.rawBody)
    } catch (ex) {
        handleApiError(ex, res)
    }
}

module.exports = busboyMiddleware
