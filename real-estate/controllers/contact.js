var express = require('express');
var router = express.Router();
const Contact = require('../repository/ContactRes')

// POST: / => Save contact
router.post('/', async(req, res, next) => {
    var data = req.body
    if (!data.propertyId&&!data.propertyOwner){
        return res.json({code: 0})
    }
    var contact = await Contact.saveContact(data)
    if (contact){
        res.json({code: 0})
    }else
        res.json({code: -1})
    
});

router.delete('/:id', async(req, res, next) => {
    var id = req.params.id
    var contact = await Contact.removeContact({_id: id, propertyOwner: req.user.accountId})
    if (contact){
        res.json({code: 0})
    }else
        res.json({code: -1})
})

module.exports = router;