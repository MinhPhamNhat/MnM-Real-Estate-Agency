var express = require('express');
var router = express.Router();
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')
const User = require('../repository/UserRes')
const authenticate = require('../middleware/authenticate')

// GET: / => Get censor page
router.get('/',authenticate.adminAuthen , async(req, res, next) => {
    var data = await Property.getBaseProperty({status: false, authen: false},0,undefined,{date:-1})
    if (data.code==0)
    res.status(200).render('admin', {data:data.data});
    else
    res.status(404).render('404')
});

// GET: /id => Get property that is uncencor
router.get('/:id', async(req, res, next) => {
    var id = req.params.id
    if(id){
        var data = await Property.getProperty({_id: id, status:false})
        if (data.code===0){
            var author = await User.findUserById(data.data.authorId)
            var authorProperty = await Property.getBaseProperty({authorId: data.data.authorId, status:true},0,3,{date: -1})
            var numOfDoc = await Statistic.getNumberOfProperty({authorId: data.data.authorId, status:true})
            res.status(200).render('detail', {
                data: data.data, 
                author: author.data, 
                authorProperty: authorProperty.data,
                numOfDoc
            })
        }else{
            res.status(404).render("404")  
        }
    }else{
        res.status(404).render("404")
    }
})


// POST: / => property require cencor to admin
router.post('/', async(req, res, next) => {
    var id = req.body.id
    if (id){
        var property = await Property.requireCensor({_id: id, authorId: req.user.accountId})
        if (property){
            res.status(200).json({code: 0})
        }else{
            res.status(404).json({code: -1})
        }
    }else{
        res.status(404).json({code: -1})
    }
})
module.exports = router;