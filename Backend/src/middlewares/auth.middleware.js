const jwt = require('jsonwebtoken')
const BlacklistToken = require('../models/blacklistToken.model')

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Unauthorized request, token missing or invalid!'
            })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized request, token missing or invalid!'
            })
        }

        const blacklistedToken = await BlacklistToken.findOne({ token })

        if (blacklistedToken) {
            return res.status(401).json({
                message: 'Unauthorized request, token has been invalidated!'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    } catch (err) {
        console.error('JWT token verification error:', err)

        return res.status(401).json({
            message: 'Unauthorized request, token missing or invalid!'
        })
    }
}

module.exports = protect
