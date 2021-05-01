const mongoose = require('mongoose')

const censorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reason: String,
    date: Date,
    propertyOwner: String,
    propertyId: {type: mongoose.Schema.Types.ObjectId, ref:'properties'},
    isApproved: Boolean
})

module.exports = mongoose.model("censors", censorSchema)