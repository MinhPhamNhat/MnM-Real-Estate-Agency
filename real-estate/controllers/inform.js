var express = require('express');
var router = express.Router();
const Censor = require('../repository/CensorRes')
const Inform = require('../repository/InformRes')
const authenticate = require('../middleware/authenticate')

// POST: / => Save contact
router.post('/contact', async(req, res, next) => {
    var data = req.body
    if (!data.propertyId&&!data.propertyOwner){
        return res.json({code: 0})
    }
    var contact = await Inform.saveNewInform("contact",data)
    if (contact){
        res.json({code: 0})
    }else
        res.json({code: -1})
    
});

// POST: / => Save censor inform
router.post('/censor',authenticate.adminAuthen , async(req, res, next) => {
    var data = req.body
    if (!data.propertyId&&!data.propertyOwner){
        return res.json({code: 0})
    }
    var censor = await Inform.saveNewInform("censor",data)
    if (censor){
        res.json({code: 0})
    }else
        res.json({code: -1})
    
});

// DELETE: / => delete inform
router.delete('/:id', async(req, res, next) => {
    var id = req.params.id
    console.log(id)
    var inform = await Inform.removeInform({_id: id, ownerId: req.user.accountId})
    if (inform){
        res.json({code: 0})
    }else
        res.json({code: -1})
})

// GET: /id => get information
router.get('/:id', async(req, res, next) => {
    var id = req.params.id
    var inform = await Inform.getInformById({_id: id, ownerId: req.user.accountId})
    if (inform.code===0){
        res.json({code: 0, data:inform.data})
    }else
        res.json({code: -1})
})
module.exports = router;