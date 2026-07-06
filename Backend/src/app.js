const express = require('express')
const app = express()
const dbConnection = require('./config/db.connection')
const authRouter = require('./routes/auth.route')

// Database Connection

dbConnection()

// Middlewares

app.use(express.json())

app.use(express.urlencoded({ extended : true }))

// Routes

app.use('/api/auth', authRouter)

module.exports = app