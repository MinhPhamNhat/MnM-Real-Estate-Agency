const mongoose = require('mongoose')
const Property = require('../models/property')

module.exports = {
    createProperty: async(data, authorId) => {
        var newProperty = await new Property({
            title: data.title,
            isSale: data.isSale === "True" ? true : false,
            type: data.type,
            location: {
                cityId: data.city,
                districtId: data.district,
            },
            address: data.address,
            price: {
                price: data.price,
                unit: data.unit,
            },
            area: data.area,
            description: data.description,
            features: {
                rooms: data.rooms,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                floors: data.floors,
            },
            thumbnail: data.thumbnail,
            phoneContact: data.phone,
            nameContact: data.name,
            date: new Date(),
            authorId,
        }).save()
        if (newProperty) {
            return JSON.stringify({ code: 0, message: "Success", data: newProperty })
        } else {
            return JSON.stringify({ code: -1, message: "Failed" })
        }
    },

    getPropertyById: async(_id) => {
        var property = await Property.findOne({ _id }).exec()
        if (property) {
            return JSON.stringify({ code: 0, message: "Success", data: property })
        } else {
            return JSON.stringify({ code: -1, message: "Failed" })
        }
    },

    getProperty: async(query, skip, limit) => {
        var properties = await Property.find(query).skip(skip).limit(limit).exec()
        if (properties) {
            return JSON.stringify({ code: 0, message: "success", data: properties })
        } else {
            return JSON.stringify({ code: -1, message: "failed" })
        }
    }
}