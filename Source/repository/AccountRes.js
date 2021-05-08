const mongoose = require('mongoose')
const Account = require('../models/AccoutnSchema')
const User = require('../models/UserSchema')
module.exports = {
    checkAccount: async (username, password) => {
        var accHandler = await Account.findOne({ username: username, password:password }).exec()
        if (accHandler) {
            return { code: 0, message: "Success", data: accHandler._id }
        } else {
            return { code: -1, message: "Tên tài khoản hoặc mật khẩu không đúng." }
        }
    },

    createAccount: async (payload) => {
        var check = await User.find({ $or: [{ email: payload.email }, { username: payload.username }] }).exec()
        if (check.length) {
            for (err of check){
                if (err.email === payload.email)
                return {code: -1, err:{msg: "Email đã tồn tại", param:"email"}}
                else if (err.username === payload.username)
                return {code: -1, err:{msg: "Username đã tồn tại", param:"username"}}
            }
        }else{
            var newAccount = await new Account({
                username: payload.username,
                password: payload.password
            }).save()
            if (newAccount){
                var newUser = await new User({
                    accountId: newAccount._id,
                    username: payload.username,
                    name: payload.name,
                    email: payload.email,
                    phone: '',
                    role: false,
                }).save()
                return {code: 0, message:"Tạo tài khoản thành công", data:newUser}
            }else{
                return {code: -1, message:"Đã xảy ra lỗi khi tạo tài khoản"}
            }
        }

    },

}