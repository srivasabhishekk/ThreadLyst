const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    googleId : {
        type : String, required : true, unique : true
    },
    email : {
        type : String, required : true, unique : true
    },
    accessToken : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String,
        required : true
    },
    expiryTime : {
        type : Number,
        required : true
    }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel