var express = require('express');
var router = express.Router();
const User = require('../repository/UserRes')
const Account = require('../repository/AccountRes')
const Statistic = require('../repository/StatisticRes')
const Property = require('../repository/PropertyRes')
const authenticate = require('../middleware/authenticate')

// GET: / => Get censor page
router.get('/',authenticate.adminAuthen , async(req, res, next) => {
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    res.render('dashboard', {route: '', numOfUncensorProp});
});

router.get('/user-management',authenticate.adminAuthen, async(req, res, next)=>{
    var users = await User.findAllUserWith({'role.user': true})
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    res.render('dashboard', {users, route: "user-management", numOfUncensorProp});
})

router.get('/staff-management',authenticate.adminAuthen, async(req, res, next)=>{
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    res.render('dashboard', {route: "staff-management", numOfUncensorProp});
})

router.get('/uncensor-property',authenticate.adminAuthen, async(req, res, next)=>{
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    var properties = await Property.getAllProperty({status: false, authen: false})
    res.render('dashboard', {properties, route: "uncensor-property", numOfUncensorProp});
})

router.get('/property-management',authenticate.adminAuthen, async(req, res, next)=>{
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    var properties = await Property.getAllProperty({})
    res.render('dashboard', {properties, route: "property-management", numOfUncensorProp});
})


// DELETE: /id => delete user
router.delete('/account/:id', authenticate.adminAuthen, async(req, res, next) => {
    var accountId = req.params.id
    if (accountId){
        var removeUserRes = await Account.removeAccount(accountId)
        return res.json(removeUserRes)
    }else{
        return res.json({code: -3, message: "Invalid Params"})
    }
})

// GET: /id => get user inform
router.get('/account/:id', authenticate.adminAuthen, async (req, res, next)=>{
    var userId = req.params.id
    try {
      var user = await User.findUserById(userId)
      if (user.code === 0){
          var numOfProperty = await Statistic.getNumberOfProperty({authorId: userId})
          return res.json({...user, numOfProperty})
      }
      return res.json(user)
    }catch{
      return res.json({code: -2, message:"Cannot find user"})
    }
  })
module.exports = router
