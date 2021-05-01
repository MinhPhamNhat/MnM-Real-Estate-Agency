const Inform = require("../models/InformationSchema")
const Contact = require("../repository/ContactRes")
const Censor = require("../repository/CensorRes")
const Property = require("../models/PropertySchema")
const mongoose = require("mongoose")
module.exports = {
    saveNewInform: async (type, data) =>{
        var property = await Property.findOne({ _id: data.propertyId, authorId: data.propertyOwner}).exec()
        if (property){
            if (type === "contact"){
                var contact = await Contact.saveContact(data)
                if (contact){
                    var newInform = await new Inform({
                        _id: mongoose.Types.ObjectId(),
                        ownerId: data.propertyOwner,
                        type,
                        contact,
                        date: new Date(),
                        isRead: false,
                    }).save()
                    if (newInform){
                        return true
                    }
                }
            }else if(type === "censor"){
                var censor = await Censor.saveCensor(data)
                if (censor){
                    if (!data.isApproved){
                        property.authen = true
                        property.status = false
                        property.save()
                    }else{
                        property.authen = true
                        property.status = true
                        property.save()
                    }
                    console.log(property)
                    var newInform = await new Inform({
                        _id: mongoose.Types.ObjectId(),
                        ownerId: data.propertyOwner,
                        type,
                        censor,
                        date: new Date(),
                        isRead: false,
                    }).save()
                    if (newInform){
                        return true
                    }
                }
            }
        }
        return false
    },

    removeInform: async (query) =>{
        var inform = await Inform.findOneAndDelete(query).exec()
        if (inform){
            if (inform.type==='contact'){
                await Contact.removeContact({_id: inform.contact._id})
            }else if (inform.type==='censor'){
                await Censor.removeCensor({_id: inform.censor._id})
            }
            return true
        }
        return false
    },

    getInformById: async (query) =>{
        var inform = await Inform.findOne(query)
        .populate({
            path : 'contact',
            populate : {
              path : 'propertyId',
              select: 'title _id'
            }
          })
        .populate({
            path : 'censor',
            populate : {
              path : 'propertyId',
              select: 'title    _id'
            }
          }).exec()
        inform.isRead = true
        inform.save()
        if (inform){
            return {code: 0, data: inform}
        }
        return {code: -1}
    },

    getInform: async (query) =>{
        var inform = await Inform.find(query)
        .populate({
            path : 'contact',
            populate : {
              path : 'propertyId',
              select: 'title _id'
            }
          })
        .populate({
            path : 'censor',
            populate : {
              path : 'propertyId',
              select: 'title    _id'
            }
          }).sort({date: -1}).exec()
        if (inform){
            return {code: 0, data: inform}
        }
        return {code: -1}
    }
}