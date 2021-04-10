const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = {
    findUserById: async (userId) => {
        var userHandler = await User.findOne({accountId: userId}).exec()
        if (userHandler){
            return JSON.stringify({code: 0, message: "Success", data: userHandler})
        }else{
            return JSON.stringify({code: -1, message: "Username hoặc password không đúng."})
        }
    },
}