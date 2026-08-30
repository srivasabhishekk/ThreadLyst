const mongoose = require('mongoose')

const blacklistedTokenSchema = new mongoose.Schema({
    token : { type : String, required : true, unique : true }
}, {
    timestamps : true
})

const blacklistedTokenModel = mongoose.model("token", blacklistedTokenSchema)

module.exports = blacklistedTokenModel