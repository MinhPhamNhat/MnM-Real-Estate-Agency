const mongoose = require('mongoose')

const propertySchema = mongoose.Schema({
    title: String,
    isSale: Boolean,
    type: String,
    location: {
        cityId: String,
        districtId: String,
    },
    address: String,
    price: Number,
    area: Number,
    description: String,
    features: {
        rooms: Number,
        bedrooms: Number,
        bathrooms: Number,
        floors: Number,
    },
    thumbnail: Array,
    phoneContact: String,
    nameContact: String,
    emailContact: String,
    date: Date,
    authorId: String,
})

module.exports = mongoose.model("properties", propertySchema)