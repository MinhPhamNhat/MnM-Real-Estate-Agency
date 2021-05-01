const mongoose = require('mongoose')

const contactSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    propertyOwner: String,
    propertyId: {type: mongoose.Schema.Types.ObjectId, ref:'properties'},
    name: String,
    phone: String,
    email: String,
    desc: String,
    date: Date,
})

module.exports = mongoose.model("contacts", contactSchema)