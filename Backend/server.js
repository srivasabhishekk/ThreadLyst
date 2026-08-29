require('dotenv').config()
const app = require('./src/app')
const dbConnection = require('./src/config/db.connection')

// Database connection
dbConnection()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server Listening at port ${PORT}`)
})