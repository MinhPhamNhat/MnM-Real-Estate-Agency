const Property = require('../models/PropertySchema')
const City = require('./CityRes')
const District = require('./DistrictRes')

const parseBaseProperty = async (property) => {
    var city = await City.getCityById(property.location.cityId)
    var district = await District.getDistrictById(property.location.districtId)
    return {
        location: {
            city: city?city.name:"",
            district: district?district.name:""
        },
        features: property.features,
        thumbnail: property.thumbnail[0],
        _id: property._id,
        title: property.title,
        isSale: property.isSale,
        type: property.type,
        price: property.price,
        area: property.area,
        authorId: property.authorId
    }
}

module.exports = {
    createProperty: async(data, authorId) => {
        if (data.price<=0){
            return { code: -1, message: "Failed" }
        }
        var newProperty = await new Property({
            title: data.title,
            isSale: data.isSale === "True" ? true : false,
            type: data.type,
            location: {
                cityId: data.city,
                districtId: data.district,
            },
            address: data.address,
            price: data.unit==="n"?0:(Number(data.price) * (data.unit==="hm"?100:data.unit==="b"?1000:data.unit==="hb"?100000:1)),
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
            emailContact: data.email,
            date: new Date(),
            authorId,
        }).save()
        if (newProperty) {
            return { code: 0, message: "Success", data: newProperty }
        } else {
            return { code: -1, message: "Failed" }
        }
    },

    getPropertyById: async(_id) => {
        var property = await Property.findOne({ _id }).exec()
        if (property) {
            return { code: 0, message: "Success", data: property }
        } else {
            return { code: -1, message: "Failed" }
        }
    },

    getBaseProperty: async(query, skip, limit, sortBy) => {
        Object.keys(query).forEach(key => query[key] === undefined && delete query[key])
        var properties = await Property.find(query)
        .select('authorId title features location price area thumbnail type isSale')
        .sort(sortBy).skip(skip).limit(limit).exec()
        if (properties) {
            var data = properties.map(value=> {
                return parseBaseProperty(value)
            })
            return { code: 0, message: "success", data: await Promise.all(data) }
        } else {
            return { code: -1, message: "failed" }
        }
    },
}