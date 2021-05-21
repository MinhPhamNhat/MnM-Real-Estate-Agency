var express = require('express');
var router = express.Router();
const Inform = require('../repository/InformRes')
const authenticate = require('../middleware/authenticate')

// POST: / => Save contact inform
router.post('/contact', async(req, res, next) => {
    var data = req.body
    if (!data.propertyId||!data.propertyOwner||!data.phone){
        return res.status(404).json({code: -1})
    }
    var contact = await Inform.saveNewInform("contact",data)
    if (contact){
        res.status(200).json({code: 0})
    }else
        res.status(404).json({code: -1})
    
});

// POST: / => Save censor inform
router.post('/censor',authenticate.adminAndStaffAuthen , async(req, res, next) => {
    var data = req.body
    if (!data.propertyId&&!data.propertyOwner){
        return res.status(404).json({code: -1})
    }
    data.author = req.user._id
    var censor = await Inform.saveNewInform("censor",data)
    if (censor){
        res.status(200).json({code: 0})
    }else
        res.status(404).json({code: -1})
    
});

// POST: / => Save warn inform
router.post('/warn',authenticate.adminAndStaffAuthen , async(req, res, next) => {
    var data = req.body
    data.author = req.user._id
    var warn = await Inform.saveNewInform("warn",data)
    if (warn){
        res.status(200).json({code: 0})
    }else
        res.status(404).json({code: -1})
    
});

// DELETE: / => delete inform
router.delete('/:id', async(req, res, next) => {
    var id = req.params.id
    console.log(id)
    var inform = await Inform.removeInform({_id: id, ownerId: req.user.accountId})
    if (inform){
        res.status(200).json({code: 0})
    }else
        res.status(404).json({code: -1})
})

// GET: /id => get information
router.get('/:id', async(req, res, next) => {
    var id = req.params.id
    var inform = await Inform.getInformById({_id: id, ownerId: req.user.accountId})
    if (inform.code===0){
        res.status(200).json({code: 0, data:inform.data})
    }else
        res.status(404).json({code: -1})
})
module.exports = router;