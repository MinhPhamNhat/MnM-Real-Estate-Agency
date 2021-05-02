const mongoose = require('mongoose')
const City = require('../models/CitySchema')

module.exports = {
    getCity: async () => {
        var cityHandler = await City.find().sort({name:1}).exec()
        if (cityHandler){
            return {code: 0, message: "Success", data: cityHandler}
        }else{
            return {code: -1, message: "Failed"}
        }
    },
    getCityById : async (cityId) => {
        var city = await City.findOne({cityId}).exec()
        return city
    }
}