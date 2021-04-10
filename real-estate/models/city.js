const mongoose = require('mongoose')

const citySchema = mongoose.Schema({
    cityId: String,
    name: String
})

module.exports = mongoose.model("cities", citySchema)