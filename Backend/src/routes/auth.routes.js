const { Router } = require('express')
const { signIn, initAuthorization, logout } = require('../controllers/auth.controllers')
const protect = require('../middlewares/auth.middleware')
const authRouter = Router()

authRouter.post('/sign-in', signIn)

authRouter.get('/callback', initAuthorization)

authRouter.get('/logout', protect, logout)

module.exports = authRouter