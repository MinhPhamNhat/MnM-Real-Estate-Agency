const mongoose = require('mongoose')

const warnSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    propertyOwner:  {
        type: String, 
        require: true
    },
    author: {
        type: String, 
        ref:'users'
    },
    content: String,
    propertyId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'properties'
    },
    date: Date,
})

module.exports = mongoose.model("warns", warnSchema)