const express = require('express')
const app = express()
const session = require('express-session')
const dbConnection = require('./config/db.connection')

// Database Connection

dbConnection()

// Middlewares

app.use(express.json())

app.use(express.urlencoded({ extended : true }))

module.exports = app