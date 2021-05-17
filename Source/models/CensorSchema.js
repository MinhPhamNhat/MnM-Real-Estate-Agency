const mongoose = require('mongoose')

const censorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: {
        type: String,
        ref: 'users'
    },
    reason:  {
        type: String, 
        require: true
    },
    date: Date,
    propertyOwner:  {
        type: String, 
        require: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'properties'
    },
    isApproved: Boolean
})

module.exports = mongoose.model("censors", censorSchema)