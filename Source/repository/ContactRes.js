
const Contact = require('../models/ContactSchema')
const Property = require('../models/PropertySchema')
const mongoose = require("mongoose")
module.exports = {
    saveContact: async (data) => {
        data.date = new Date()
        data._id = mongoose.Types.ObjectId()
        var contact = await new Contact(data).save()
        return contact._id
    },
    getContact: async(query, skip, limit)=>{
        var contacts = await Contact.find(query).sort({date: 1}).skip(skip).limit(limit).exec()
        var temp = [...contacts]
        var data = contacts.map(async value=>{
            if (!value.isRead){
                return await Contact.findByIdAndUpdate(value._id,{isRead: true} ,{new: false}).exec()
            }
            return value
        })
        return await Promise.all(data)
    },
    removeContact: async(query)=>{
        var contact = await Contact.findOneAndDelete(query).exec()
        if (contact){
            return true
        }
        return false
    }
}