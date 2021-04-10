const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
})

module.exports = mongoose.model("accounts", accountSchema)