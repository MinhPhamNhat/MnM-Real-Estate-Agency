
const Censor = require('../models/CensorSchema')
const mongoose = require("mongoose")
module.exports = {
    saveCensor: async (data) => {
        data.date = new Date()
        data._id = mongoose.Types.ObjectId()
        var censor = await new Censor(data).save()
        return censor._id
    },
    removeCensor: async(query)=>{
        var censor = await Censor.findOneAndDelete(query).exec()
        if (censor){
            return true
        }
        return false
    },
}