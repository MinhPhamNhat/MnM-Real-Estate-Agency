const { query } = require("express-validator");
const City = require("../models/CitySchema")
const District = require("../models/DistrictSchema")
const Property = require("../models/PropertySchema")
const Contact = require("../models/ContactSchema");
const Inform = require("../models/InformationSchema");
const Payment = require("../models/PaymentShcema")
module.exports = {
    getMinMaxRange: async () => {
        var _temp = await Property.aggregate([{
            $group: {
                _id: null,
                maxPrice: { $max: '$price' },
                minPrice: { $min: '$price' },
                maxArea: { $max: '$area' },
                minArea: { $min: '$area' }
            }
        }]).exec();
        return _temp[0]
    },

    getNumberOfProperty: async (query)=>{
        Object.keys(query).forEach(key => query[key] === undefined && delete query[key])
        return await Property.countDocuments(query).exec()
    },

    getNumOfContact: async (query) => {
        Object.keys(query).forEach(key => query[key] === undefined && delete query[key])
        return await Contact.countDocuments(query).exec()
    },

    getNumOfInform: async (query) => {
        Object.keys(query).forEach(key => query[key] === undefined && delete query[key])
        return await Inform.countDocuments(query).exec()
    },

    getNumOfPayment: async(query)=>{
        return await Payment.countDocuments(query).exec()
    }

}