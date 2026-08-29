const mongoose = require('mongoose')

const dbConnection = async () => {
    try{
        const uri = process.env.MONGODB_CONNECTION_STRING

        const connect = await mongoose.connect(uri)

        console.log(connect.connection.name, connect.connection.host)
    }catch(err){
        console.log(err)

        process.exit(1)
    }
}

module.exports = dbConnection