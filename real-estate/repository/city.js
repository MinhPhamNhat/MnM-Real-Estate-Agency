const mongoose = require('mongoose')
const City = require('../models/city')

module.exports = {
    getCity: async () => {
        var cityHandler = await City.find().exec()
        if (cityHandler){
            return JSON.stringify({code: 0, message: "Success", data: cityHandler})
        }else{
            return JSON.stringify({code: -1, message: "Failed"})
        }
    },
}