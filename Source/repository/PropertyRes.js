const Property = require('../models/PropertySchema')
const CityRes = require('./CityRes')
const DistrictRes = require('./DistrictRes')
const Contact = require('../models/ContactSchema')
const User = require('../models/UserSchema')

const parseBaseProperty = async (property) => {
    var city = await CityRes.getCityById(property.location.cityId)
    var district = await DistrictRes.getDistrictById(property.location.districtId)
    var author = await User.findOne({accountId: property.authorId}).exec()
    var location = {
        city: {
            name: city?city.name:"",
            id: property.location.cityId
        },
        district: {
            name: district?district.name:"",
            id: property.location.districtId
        }
    }
    var tempProperty = {
        _id: property._id,
        title: property.title,
        isSale: property.isSale,
        type: property.type,
        location,
        address: property.address,
        price: property.price,
        area: property.area,
        description: property.description,
        features: property.features,
        thumbnail: property.thumbnail,
        date: property.date,
        authorId: property.authorId,
        status: property.status,
        authen: property.authen,
        author
    }
    return tempProperty
}

module.exports = {
    createProperty: async(data, authorId) => {
        if (data.price<=0){
            return { code: -1, message: "Failed" }
        }
        if (data.area<=0){
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
            date: new Date(),
            status: false,
            authen: false,
            authorId,
        }).save()
        if (newProperty) {
            return { code: 0, message: "Success", data: newProperty }
        } else {
            return { code: -1, message: "Failed" }
        }
    },

    getPropertyById: async(query) => {
        var property = await Property.findOne(query).exec()
        if (property) {
            return { code: 0, message: "Success", data: await parseBaseProperty(property) }
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
                value.thumbnail = value.thumbnail[0]
                return parseBaseProperty(value)
            })
            
            return { code: 0, message: "success", data: await Promise.all(data) }
        } else {
            return { code: -1, message: "failed" }
        }
    },
    
    editProperty: async(_id, data, authorId) => {
        if (data.price<=0){
            return { code: -1, message: "Failed" }
        }
        var saveProperty ={
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
            authen: false,
            status: false,
        }
        Object.keys(saveProperty).forEach(key => saveProperty[key] === undefined && delete saveProperty[key])
        var newProperty = await Property.findOneAndUpdate({_id, authorId}, saveProperty, {new: true}).exec()
        if (newProperty) {
            return { code: 0, message: "Success", data: newProperty }
        } else {
            return { code: -1, message: "Failed" }
        }
    },

    deleteProperty: async(_id, authorId, isAdmin) => {
        if (isAdmin)
            var oldProperty = await Property.findOneAndDelete({_id}).exec()
        else
            var oldProperty = await Property.findOneAndDelete({_id, authorId}).exec()
        if (oldProperty) {
            await Contact.deleteMany({propertyId: oldProperty._id}).exec()
            return { code: 0, message: "Success"}
        } else {
            return { code: -1, message: "Failed" }
        }
    },
    
    approveProperty: async(_id) => {
        var oldProperty = await Property.findOne({_id}).exec()
        if (oldProperty) {
            oldProperty.status = true
            oldProperty.authen = true
            oldProperty.save()
            return { code: 0, message: "Success"}
        } else {
            return { code: -1, message: "Failed" }
        }
    },
    
    requireCensor: async(query)=>{
        var property = await Property.findOne(query).exec()
        if (property){
            property.authen = false
            await property.save()
            return true
        }
        return false
    }
}