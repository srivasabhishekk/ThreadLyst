const mongoose = require('mongoose')

const dbConnection = async () => {
    try{
        const url = process.env.MONGODB_CONNECTION_STRING
        const connect = await mongoose.connect(url)
        console.log("Database Connected")
        console.log(connect.connection.name, connect.connection.host)
    }catch(err){
        console.log('Error while connecting database', err)
        process.exit(1)
    }
}

module.exports = dbConnection