const Payment = require('../models/PaymentShcema')
const Inform = require("../models/InformationSchema")
const mongoose = require("mongoose")
const User = require('../models/UserSchema')
module.exports = {
    pay: async (accountId, data) => {
        var a = await new Payment({
            accountId,
            denom: Number(data.denom),
            cardType: data['card-type'],
            seri: data.seri,
            code: data.code,
            isAproved: false,
            status: true,
            date: new Date()
        }).save()
        if (a){
            return {code: 0}
        }else{
            return {code:-1}
        }
    },

    getPayment: async (query) => {
        return await Payment.find(query).sort({date: -1}).populate("accountId").exec()
    },

    authenPay: async (author, payId, type)=>{
        var payment = await Payment.findOne({_id: payId})
        var user = await User.findOne({_id: payment.accountId}).exec()
        if (type){
            payment.isAproved = true
            payment.status = true
            user.balance += payment.denom
            user.save()
        }else{
            payment.isAproved = false
            payment.status = false
            payment.reason = "Mã thẻ hoặc seri không hợp lệ"
        }
        payment.author = author
        payment.save()
        var newInform = await new Inform({
            _id: mongoose.Types.ObjectId(),
            ownerId: user.accountId,
            type: "payment",
            payment: payId,
            date: new Date(),
            isRead: false,
        }).save()
        if (newInform){
            return {code: 0}
        }else{
            return {code: -1}
        }
    },
    
}