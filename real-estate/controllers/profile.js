const express = require('express');
const router = express.Router();
const User = require('../repository/UserRes')
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')
const func = require("../function/function")
const authenticate = require('../middleware/authenticate');
// GET: /id => Get user profile
router.get('/:id', async function(req, res, next) {
  var id = req.params.id
  if (id){
    var user = await User.findUserById(id)
    if (user.code===0){
      var data = await Property.getBaseProperty({authorId: id},0,6,{date: -1})
      if (data.code===0){

        var numOfDoc = await Statistic.getNumberOfProperty({authorId: id})
        var page = 1
        var pageRange = func.createPageRange(page, Math.ceil(numOfDoc/6))
        res.render('profile', {profile: user.data, data: data.data,page, pageRange, numOfDoc});
      }
      else
      res.render("404")
    }else{
      res.render("404")
    }
  }else{
    res.render("404")
  }
});

router.post("/",authenticate.authen, async(req, res, next)=>{
  var data = req.body
  var user = await User.updateUser(req.user.accountId, data)
    if (user.code===0){
      var data = await Property.getBaseProperty({authorId: user.accountId},0,6,{date: -1})
      if (data.code===0){
        var numOfDoc = await Statistic.getNumberOfProperty({authorId: id})
        var page = 1
        var pageRange = func.createPageRange(page, Math.ceil(numOfDoc/6))
        res.render('profile', {profile: user.data, data: data.data,page, pageRange, numOfDoc});
      }
      else
      res.render("404")
    }else{
      res.render("404")
    }
})

module.exports = router;
