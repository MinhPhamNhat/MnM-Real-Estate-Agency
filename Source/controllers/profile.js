const express = require('express');
const router = express.Router();
const User = require('../repository/UserRes')
const Account = require('../repository/AccountRes')
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')
const Payment = require('../repository/PaymentRes')
const func = require("../function/function")
const authenticate = require('../middleware/authenticate');
const Inform = require("../repository/InformRes")
const upload = require('../middleware/file')
const path = require('path')
const firebase = require('firebase-admin')
const fs = require('fs')
const validator = require('../middleware/validator')
const {validationResult} = require('express-validator')
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4()


// GET: /id => Get user profile
router.get('/property/:id', async function(req, res, next) {
  var id = req.params.id
  if (id){
    var user = await User.findUserById(id)
    if (user.code===0){
      var data = await Property.getBaseProperty({authorId: id, status:true},0,6,{})
      if (data.code===0){
        if (req.user){
          var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
        }
        var numOfDoc = await Statistic.getNumberOfProperty({authorId: id, status:true})
        var page = 1
        var pageRange = func.createPageRange(page, Math.ceil(numOfDoc/6))
        res.status(200).render('profile', {
          route: "property",
          profile: user.data, 
          data: data.data,page, 
          pageRange, 
          numOfUnreadInform, 
        });
      }
      else
      res.status(404).render("404")
    }else{
      res.status(404).render("404")
    }
  }else{
    res.status(404).render("404")
  }
});

// POST: => update user profile
router.post("/",authenticate.authen, upload.single('picture'), async(req, res, next)=>{
  var data = req.body
  if (req.file){
    const bucket = firebase.storage().bucket()
    var img = req.file
    var blob = bucket.file(img.filename)
    const blobWriter = blob.createWriteStream({
        metadata: {
            contentType: img.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: uuid,
            }
        }
    })
    var buffer = fs.readFileSync(path.join(__dirname, "../uploads/"+img.filename))
    blobWriter.end(buffer)
    blobWriter.on('error', (err) => {
        res.status(404).render("404")
    })
    var url = `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${img.filename}?alt=media&token=${uuid}`
  }
  data.picture = url
  var user = await User.updateUser(req.user.accountId, data)
  res.json(user)
})

// GET: /inform => get user inform page
router.get('/inform',authenticate.authen ,async (req, res, next)=>{
  var user = await User.findUserById(req.user.accountId)
  var inform = await Inform.getInform({ownerId: req.user.accountId})
  var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
  res.status(200).render('profile', {
    route: "message",
    profile: user.data, 
    inform: inform.data,  
    numOfUnreadInform, 
  });
})
// GET: /censor => get user uncensor property
router.get('/censor',authenticate.authen ,async (req, res, next)=>{
  var user = await User.findUserById(req.user.accountId)
  var numOfUncensorDoc = await Statistic.getNumberOfProperty({authorId: req.user.accountId, status: false})
  var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
  var data = await Property.getBaseProperty({authorId: req.user.accountId, status:false},0,6,{})
  var page = 1
  var pageRange = func.createPageRange(page, Math.ceil(numOfUncensorDoc/6))
  res.status(200).render('profile', {
    route: "censor",
    profile: user.data, 
    data: data.data,
    page, pageRange, 
    numOfUnreadInform, 
  });
})

// GET: /change-password => change password
router.get('/change-password',authenticate.authen ,async (req, res, next)=>{
  var user = await User.findUserById(req.user.accountId)
  var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
  res.status(200).render('profile', {
    route: "change-password",
    profile: user.data, 
    numOfUnreadInform, 
  });
})

// POST: /change-password => change password
router.post('/change-password', authenticate.authen, validator.updatePassword(), async (req, res, next)=>{
  var validate = validationResult(req);
  if (validate.errors.length) {
      let errors = validate.mapped()
      res.json({ code: -3, errors })
  }else{
      var result = await Account.updatePassword(req.user.accountId, req.body.oldPassword, req.body.newPassword)
      if (result.code===0){
          res.json({code: 0})
      }else if(result.code === -3){
          var errors = {
              oldPassword: {
              msg: 'Mật khẩu cũ không đúng',
              param: 'oldPassword',
            }
          }
          res.json({ code: -3, errors })
      }else{
          res.json({ code: -1})
      }
  }
})

router.get('/payment',authenticate.authen, async (req, res, next) => {
  var user = await User.findUserById(req.user.accountId)
  var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
  var requireInformation = req.flash('requireInformation')[0]
  res.status(200).render('profile', {
    route: "payment",
    profile: user.data, 
    numOfUnreadInform, 
    requireInformation
  });
})

router.get('/payment-history',authenticate.authen, async (req, res, next) => {
  var user = await User.findUserById(req.user.accountId)
  var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
  var payments = await Payment.getPayment({accountId: req.user._id})
  res.status(200).render('profile', {
    route: "payment-history",
    profile: user.data, 
    numOfUnreadInform, 
    payments
  });
})

router.get('/:id', async (req, res, next) =>  {
  var id = req.params.id
  if (id){
      var user = await User.findUserById(id)
      if (user.code ===0 ){
        if (req.user){
          var numOfUnreadInform = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
        }
        var requireInformation = req.flash('requireInformation')[0]
        return res.render("profile", {
          route: "infor",
          profile: user.data, 
          numOfUnreadInform,
          requireInformation
        })
      }
  }
    res.render("404")
})
module.exports = router;
