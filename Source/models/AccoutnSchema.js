const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    username:  {
        type: String, 
        require: true
    },
    password:  {
        type: String, 
        require: true
    },
})

module.exports = mongoose.model("accounts", accountSchema)