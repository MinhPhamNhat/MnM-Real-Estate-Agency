const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accountId: String,
    username:String,
    name: String,
    email: String,
    phone: String,
    role: Boolean,
})

module.exports = mongoose.model("users", userSchema)