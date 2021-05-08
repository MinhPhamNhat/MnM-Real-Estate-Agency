const mongoose = require('mongoose')

const propertySchema = mongoose.Schema({
    title: {
        type: String, 
        require: true
    },
    isSale: {
        type: Boolean, 
        require: true
    },
    type: {
        type: String, 
        require: true, 
        enum : ['personal-house', 'villa', 'street-house', 'appartment']
    },
    location: {
        cityId: {
            type: String, 
            require: true},
        districtId: {
            type: String, 
            require: true
        },
    },
    address: {
        type: String, 
        require: true
    },
    price: {
        type: Number,
        require: true, 
        min: 0
    },
    area: {
        type: Number, 
        require: true, 
        min: 1
    },
    description: {
        type: String, 
        require: true
    },
    features: {
        rooms: {
            type: Number, 
            min: 0
        },
        bedrooms: {
            type: Number, 
            min: 0
        },
        bathrooms: {
            type: Number, 
            min: 0
        },
        floors: {
            type: Number, 
            min: 0
        },
    },
    authorId:  {
        type: String, 
        require: true
    },
    thumbnail: Array,
    date: Date,
    status: Boolean,
    authen: Boolean,
})

module.exports = mongoose.model("properties", propertySchema)