const express = require('express')
const app = express()

// Middlewares

app.use(express.json())

app.use(express.urlencoded({ extended : true }))

module.exports = app