const mongoose = require('mongoose')

const districtSchema = mongoose.Schema({
    cityId: String,
    districtId: String,
    name: String
})

module.exports = mongoose.model("districts", districtSchema)