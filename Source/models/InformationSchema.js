const mongoose = require('mongoose')

const informationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ownerId: String,
    type: String,
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'contacts'},
    censor: { type: mongoose.Schema.Types.ObjectId, ref: 'censors'},
    date: Date,
    isRead: Boolean,
})

module.exports = mongoose.model("informs", informationSchema)