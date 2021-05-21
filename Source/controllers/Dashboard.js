var express = require('express');
var router = express.Router();
const User = require('../repository/UserRes')
const Account = require('../repository/AccountRes')
const Statistic = require('../repository/StatisticRes')
const Property = require('../repository/PropertyRes')
const Payment = require('../repository/PaymentRes')
const authenticate = require('../middleware/authenticate')
const validator = require('../middleware/validator')
const {validationResult} = require('express-validator')
const Censor = require('../models/CensorSchema')
// GET: / => Get censor page
router.get('/',authenticate.adminAndStaffAuthen , async(req, res, next) => {
    if (req.user.role.admin)
    res.redirect('/dashboard/user-management');
    else
    res.redirect('/dashboard/property-management');
});

router.get('/user-management',authenticate.adminAuthen, async(req, res, next)=>{
    var users = await User.findAllUserWith({'role.user': true})
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    var numOfPayment = await Statistic.getNumOfPayment({isAproved: true, status: true})
    var numOfUnauthenPayment = await Statistic.getNumOfPayment({isAproved: false, status: true})
    res.render('dashboard', {user: req.user, users, route: "user-management", numOfUncensorProp, numOfPayment, numOfUnauthenPayment});
})

router.get('/staff-management',authenticate.adminAuthen, async(req, res, next)=>{
    var users = await User.findAllUserWith({'role.staff': true})
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    var numOfPayment = await Statistic.getNumOfPayment({isAproved: true, status: true})
    var numOfUnauthenPayment = await Statistic.getNumOfPayment({isAproved: false, status: true})
    res.render('dashboard', {user: req.user, route: "staff-management",users, numOfUncensorProp, numOfPayment, numOfUnauthenPayment});
})

router.get('/uncensor-property',authenticate.adminAndStaffAuthen, async(req, res, next)=>{
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    var properties = await Property.getAllProperty({status: false, authen: false})
    var numOfPayment = await Statistic.getNumOfPayment({isAproved: true, status: true})
    var numOfUnauthenPayment = await Statistic.getNumOfPayment({isAproved: false, status: true})
    res.render('dashboard', {user: req.user, properties, route: "uncensor-property", numOfUncensorProp, numOfPayment, numOfUnauthenPayment});
})

router.get('/property-management',authenticate.adminAndStaffAuthen, async(req, res, next)=>{
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    var properties = await Property.getAllProperty({})
    var numOfPayment = await Statistic.getNumOfPayment({isAproved: true, status: true})
    var numOfUnauthenPayment = await Statistic.getNumOfPayment({isAproved: false, status: true})
    res.render('dashboard', {user: req.user, properties, route: "property-management", numOfUncensorProp, numOfPayment, numOfUnauthenPayment});
})

router.get('/pay-history',authenticate.adminAndStaffAuthen, async(req, res, next)=>{
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    var payments = await Payment.getPayment({})
    var numOfPayment = await Statistic.getNumOfPayment({isAproved: true, status: true})
    var numOfUnauthenPayment = await Statistic.getNumOfPayment({isAproved: false, status: true})
    res.render('dashboard', {user: req.user, payments, route: "pay-history", numOfUncensorProp, numOfPayment, numOfUnauthenPayment});
})

router.get('/pay-require',authenticate.adminAndStaffAuthen, async(req, res, next)=>{
    var numOfUncensorProp = await Statistic.getNumberOfProperty({status: false, authen: false})
    var payments = await Payment.getPayment({isAproved: false, status: true})
    var numOfPayment = await Statistic.getNumOfPayment({isAproved: true, status: true})
    var numOfUnauthenPayment = await Statistic.getNumOfPayment({isAproved: false, status: true})
    res.render('dashboard', {user: req.user, payments, route: "pay-require", numOfUncensorProp, numOfPayment, numOfUnauthenPayment});
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
router.get('/account/user/:id', authenticate.adminAuthen, async (req, res, next)=>{
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

// GET: /id => get staff inform
router.get('/account/staff/:id', authenticate.adminAuthen, async (req, res, next)=>{
    var userId = req.params.id
    try {
      var user = await User.findUserById(userId)

      if (user.code === 0){
        var numOfCensor = await Censor.countDocuments({author: user.data._id})
        return res.json({...user, numOfCensor})
      }
      return res.json(user)
    }catch{
      return res.json({code: -2, message:"Cannot find user"})
    }
  })

router.post('/account/staff', validator.registerValidator(), async(req, res, next) => {
    var validate = validationResult(req)
    if (validate.errors.length) {
        let errors = validate.mapped()
        for (field in errors ){
            return res.json({code: -3, err: errors[field], data: req.body})
        }
    } else {
        return Account.createStaff(req.body)
        .then(newAccount=>{
            if (newAccount.code === 0){
                return res.json( {code: 0, data: newAccount.data})
            }else if (newAccount.code === -1){
                return res.json( {code: -3, err: newAccount.err, data: req.body})
            }
        }).catch(err=> {
                return res.json({code: -1, message:"Tạo tài khoản thất bại"})
        })
    }
})
module.exports = router
