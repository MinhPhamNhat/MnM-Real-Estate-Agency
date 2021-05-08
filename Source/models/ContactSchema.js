const mongoose = require('mongoose')

const contactSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    propertyOwner:  {
        type: String, 
        require: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'properties'
    },
    phone:  {
        type: String, 
        require: true
    },
    name: String,
    email: String,
    desc: String,
    date: Date,
})

module.exports = mongoose.model("contacts", contactSchema)