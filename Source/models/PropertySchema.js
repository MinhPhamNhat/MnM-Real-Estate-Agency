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
    date: Date,
    authorId: String,
    status: Boolean,
    authen: Boolean,
})

module.exports = mongoose.model("properties", propertySchema)