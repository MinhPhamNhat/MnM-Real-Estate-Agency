const City = require("../models/CitySchema")
const District = require("../models/DistrictSchema")
const Property = require("../models/PropertySchema")

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
        console.log(query)
        return await Property.countDocuments(query).exec()
    }


}