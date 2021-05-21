const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    accountId: {
        type: String,
        ref: "users"
    },
    denom: Number,
    cardType: String,
    seri: String,
    code: String,
    author: {
        type: String,
        ref: 'users'
    },
    isAproved: Boolean,
    status: Boolean,
    reason: String,
    date: Date,
})

module.exports = mongoose.model("payments", paymentSchema)