const express = require('express');
const router = express.Router();
const User = require('../repository/UserRes')
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')
const func = require("../function/function")
const authenticate = require('../middleware/authenticate');
const Inform = require("../repository/InformRes")

// GET: /id => Get user profile
router.get('/property/:id', async function(req, res, next) {
  var id = req.params.id
  if (id){
    var user = await User.findUserById(id)
    if (user.code===0){
      var data = await Property.getBaseProperty({authorId: id, status:true},0,6,{})
      if (data.code===0){
        if (req.user){
          var numOfInform = await Statistic.getNumOfInform({ownerId: req.user.accountId})
          var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
          var numOfUncensorDoc = await Statistic.getNumberOfProperty({authorId: req.user.accountId, status: false})
        }
        var numOfDoc = await Statistic.getNumberOfProperty({authorId: id, status:true})
        var page = 1
        var pageRange = func.createPageRange(page, Math.ceil(numOfDoc/6))
        res.render('profile', {profile: user.data, data: data.data,page, pageRange, numOfDoc, numOfInform, numOfUnreadInform, numOfUncensorDoc});
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

router.get('/inform',authenticate.authen ,async (req, res, next)=>{
  var user = await User.findUserById(req.user.accountId)
  var inform = await Inform.getInform({ownerId: req.user.accountId})
  var numOfDoc = await Statistic.getNumberOfProperty({authorId: req.user.accountId, status:true})
  var numOfUncensorDoc = await Statistic.getNumberOfProperty({authorId: req.user.accountId, status: false})
  var numOfInform = await Statistic.getNumOfInform({ownerId: req.user.accountId})
  var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
  res.render('inform', {profile: user.data, inform: inform.data,  numOfDoc, numOfInform, numOfUnreadInform, numOfUncensorDoc});
})

router.get('/censor',authenticate.authen ,async (req, res, next)=>{
  var user = await User.findUserById(req.user.accountId)
  var inform = await Inform.getInform({ownerId: req.user.accountId})
  var numOfDoc = await Statistic.getNumberOfProperty({authorId: req.user.accountId, status:true})
  var numOfUncensorDoc = await Statistic.getNumberOfProperty({authorId: req.user.accountId, status: false})
  var numOfInform = await Statistic.getNumOfInform({ownerId: req.user.accountId})
  var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})

  var data = await Property.getBaseProperty({authorId: req.user.accountId, status:false},0,6,{})
  var page = 1
  var pageRange = func.createPageRange(page, Math.ceil(numOfUncensorDoc/6))
  res.render('censor', {profile: user.data, data: data.data,page, pageRange, numOfDoc, numOfInform, numOfUnreadInform, numOfUncensorDoc});
})
module.exports = router;
