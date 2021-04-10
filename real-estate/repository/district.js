const mongoose = require('mongoose')
const District = require('../models/district')

module.exports = {
    getDistrict: async () => {
        var districtHandler = await District.find().exec()
        if (districtHandler.length){
            return JSON.stringify({code: 0, message: "Success", data: districtHandler})
        }else{
            return JSON.stringify({code: -1, message: "Failed"})
        }
    },
    getDistrictByCityId: async (cityId) => {
        var districtHandler = await District.find({cityId}).exec()
        
        if (districtHandler.length){
            return JSON.stringify({code: 0, message: "Success", data: districtHandler})
        }else{
            return JSON.stringify({code: -1, message: "Failed"})
        }
    },
}