const Inform = require("../models/InformationSchema")
const Contact = require("../repository/ContactRes")
const Censor = require("../repository/CensorRes")
const Warn = require("../repository/WarnRes")
const Property = require("../models/PropertySchema")
const mongoose = require("mongoose")
module.exports = {
    saveNewInform: async (type, data) => {
        try {
            if (data.propertyId) {
                var property = await Property.findOne({ _id: data.propertyId, authorId: data.propertyOwner }).exec()
                if (property) {
                    if (type === "contact") {
                        var contact = await Contact.saveContact(data)
                        if (contact) {
                            var newInform = await new Inform({
                                _id: mongoose.Types.ObjectId(),
                                ownerId: data.propertyOwner,
                                type,
                                propertyId: data.propertyId,
                                contact,
                                date: new Date(),
                                isRead: false,
                            }).save()
                            if (newInform) {
                                return true
                            }
                        }
                    } else if (type === "censor") {
                        if (property.authen === false) {
                            var censor = await Censor.saveCensor(data)
                            if (censor) {
                                if (!data.isApproved) {
                                    property.authen = true
                                    property.status = false
                                    property.save()
                                } else {
                                    property.authen = true
                                    property.status = true
                                    property.save()
                                }
                                var newInform = await new Inform({
                                    _id: mongoose.Types.ObjectId(),
                                    ownerId: data.propertyOwner,
                                    type,
                                    censor,
                                    propertyId: data.propertyId,
                                    date: new Date(),
                                    isRead: false,
                                }).save()
                                if (newInform) {
                                    return true
                                }
                            }
                        }
                    } else if (type === "warn") {
                        var warn = await Warn.saveWarn(data)
                        
                        if (warn) {
                            var newInform = await new Inform({
                                _id: mongoose.Types.ObjectId(),
                                ownerId: data.propertyOwner,
                                type,
                                warn,
                                propertyId: data.propertyId,
                                date: new Date(),
                                isRead: false,
                            }).save()
                            if (newInform) {
                                return true
                            }
                        }
                    }
                }
            } else {
                if (type === "warn") {
                    var warn = await Warn.saveWarn(data)
                    if (warn) {
                        var newInform = await new Inform({
                            _id: mongoose.Types.ObjectId(),
                            ownerId: data.propertyOwner,
                            type,
                            warn,
                            date: new Date(),
                            isRead: false,
                        }).save()
                        if (newInform) {
                            return true
                        }
                    }
                }
            }
            return false
        } catch{
            return false
        }

    },

    removeInform: async (query) => {
        var inform = await Inform.findOneAndDelete(query).exec()
        if (inform) {
            if (inform.type === 'contact') {
                await Contact.removeContact({ _id: inform.contact._id })
            } else if (inform.type === 'censor') {
                await Censor.removeCensor({ _id: inform.censor._id })
            }
            return true
        }
        return false
    },

    getInformById: async (query) => {
        var inform = await Inform.findOne(query)
            .populate({
                path: 'contact',
                populate: {
                    path: 'propertyId',
                    select: 'title _id'
                }
            })
            .populate({
                path: 'censor',
                populate: [{
                    path: 'propertyId',
                    select: 'title   _id'
                },{
                    path: 'author',
                    select: 'name role'
                }]
            })
            .populate({
                path: 'warn',
                populate: [{
                    path: 'propertyId',
                    select: 'title   _id'
                },{
                    path: 'author',
                    select: 'name role'
                }]
            }).exec()
        inform.isRead = true
        inform.save()
        if (inform) {
            return { code: 0, data: inform }
        }
        return { code: -1 }
    },

    getInform: async (query) => {
        var inform = await Inform.find(query)
            .populate({
                path: 'contact',
                populate: {
                    path: 'propertyId',
                    select: 'title _id'
                }
            })
            .populate({
                path: 'censor',
                populate: {
                    path: 'propertyId',
                    select: 'title _id'
                }
            })
            .populate({
                path: 'warn',
                populate: {
                    path: 'propertyId',
                    select: 'title _id'
                }
            }).sort({ date: -1 }).exec()
        if (inform) {
            return { code: 0, data: inform }
        }
        return { code: -1 }
    }
}