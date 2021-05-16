const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    accountId: {
        type: String, 
        require: true
    },
    username:{
        type: String, 
        require: true
    },
    name: {
        type: String, 
        require: true
    },
    email: {
        type: String, 
        require: true
    },
    phone: String,
    role: {
        admin: Boolean,
        staff: Boolean,
        user: Boolean
    },
})

module.exports = mongoose.model("users", userSchema)