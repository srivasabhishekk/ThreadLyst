const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo').default
const dbConnection = require('./config/db.connection')

// Database Connection

dbConnection()

// Middlewares

app.use(express.json())

app.use(express.urlencoded({ extended : true }))

app.use(session({
    secret : process.env.SESSION_SECRET_KEY,
    resave : false,
    saveUninitialized : false,
    cookie : { secure : false, maxAge : 30 * 24 * 60 * 60 * 1000 },
    store : MongoStore.create({
        mongoUrl : process.env.MONGODB_CONNECTION_STRING,
        collectionName : 'sessions',
        ttl : 30 * 24 * 60 * 60
    }) 
}))

module.exports = app