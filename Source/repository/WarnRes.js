const Warn = require('../models/WarnSchema')
const mongoose = require("mongoose")

module.exports = {
    saveWarn: async (data) => {
        data.date = new Date()
        data._id = mongoose.Types.ObjectId()
        var warn = await new Warn(data).save()
        return warn._id
    },

    removeWarn: async(query)=>{
        var warn = await Warn.findOneAndDelete(query).exec()
        if (warn){
            return true
        }
        return false
    }
}