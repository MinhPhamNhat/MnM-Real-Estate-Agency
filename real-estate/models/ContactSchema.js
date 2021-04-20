const mongoose = require('mongoose')

const contactSchema = mongoose.Schema({
    propertyOwner: String,
    propertyId: String,
    name: String,
    phone: String,
    email: String,
    desc: String,
    date: Date,
    isRead: Boolean,
})

module.exports = mongoose.model("contacts", contactSchema)