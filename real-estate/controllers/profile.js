const express = require('express');
const router = express.Router();
const User = require('../repository/UserRes')
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')
const func = require("../function/function")
const authenticate = require('../middleware/authenticate');
const Contact = require("../repository/ContactRes")

// GET: /id => Get user profile
router.get('/property/:id', async function(req, res, next) {
  var id = req.params.id
  if (id){
    var user = await User.findUserById(id)
    if (user.code===0){
      var data = await Property.getBaseProperty({authorId: id},0,6,{})
      if (data.code===0){
        if (req.user){
          var numOfContact = await Statistic.getNumOfContact({propertyOwner: req.user.accountId})
          var numOfNoti = await Statistic.getNumOfContact({propertyOwner: req.user.accountId, isRead: false})
        }
        var numOfDoc = await Statistic.getNumberOfProperty({authorId: id})
        var page = 1
        var pageRange = func.createPageRange(page, Math.ceil(numOfDoc/6))
        res.render('profile', {profile: user.data, data: data.data,page, pageRange, numOfDoc, numOfContact, numOfNoti});
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
        res.redirect(`/profile/property/${user.data.accountId}`);
    }else{
      res.render("404")
    }
})

router.get('/contact',authenticate.authen ,async (req, res, next)=>{
  var user = await User.findUserById(req.user.accountId)
  var contact = await Contact.getContact({propertyOwner: req.user.accountId},0,10)
  var numOfContact = await Statistic.getNumOfContact({propertyOwner: req.user.accountId})
  var numOfDoc = await Statistic.getNumberOfProperty({authorId: req.user.accountId})
  var numOfNoti = await Statistic.getNumOfContact({propertyOwner: req.user.accountId, isRead: false})
  res.render('contact', {profile: user.data,contact,  numOfDoc, numOfContact, numOfNoti});
})

module.exports = router;
