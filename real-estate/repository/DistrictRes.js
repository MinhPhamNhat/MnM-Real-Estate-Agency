const mongoose = require('mongoose')
const District = require('../models/DistrictSchema')

module.exports = {
    getDistrict: async () => {
        var districtHandler = await District.find().sort({name:1}).exec()
        if (districtHandler.length){
            return {code: 0, message: "Success", data: districtHandler}
        }else{
            return {code: -1, message: "Failed"}
        }
    },
    getDistrictByCityId: async (cityId) => {
        var districtHandler = await District.find({cityId}).sort({name:1}).exec()
        
        if (districtHandler.length){
            return {code: 0, message: "Success", data: districtHandler}
        }else{
            return {code: -1, message: "Failed"}
        }
    },
    getDistrictById: async (districtId) => {
        var district = await District.findOne({districtId}).exec()
        return district
    }
}