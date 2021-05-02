const mongoose = require('mongoose')
const User = require('../models/UserSchema')

module.exports = {
    findUserById: async (userId) => {
        var userHandler = await User.findOne({accountId: userId}).exec()
        if (userHandler){
            return {code: 0, message: "Success", data: userHandler}
        }else{
            return {code: -1, message: "Failed"}
        }
    },

    updateUser: async(userId, data) =>{
        Object.keys(data).forEach(key => (!data[key] || data[key] === 'undefined') && delete data[key])
        var userHandler = await User.findOneAndUpdate({accountId: userId}, data).exec()
        if (userHandler){
            return {code: 0, message: "Success", data: userHandler}
        }else{
            return {code: -1, message: "Failed"}
        }
    }
}