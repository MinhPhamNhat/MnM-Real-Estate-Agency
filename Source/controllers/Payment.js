const express = require('express')
const router = express.Router()
const Payment = require('../repository/PaymentRes')
// GET: / => Logout
router.post('/', async (req, res, next) => {
    var payment = await Payment.pay(req.user._id, req.body)
    if (payment.code===0){
        res.redirect(`/profile/${req.user.accountId}`)
    }else{
        res.render('404')
    }
})

// GET: / => Logout
router.post('/declide', async (req, res, next) => {
    var payment = await Payment.authenPay(req.user._id, req.body.id, req.body.isApproved)
    res.json(payment)
})

// GET: / => Logout
router.post('/accept', async (req, res, next) => {
    var payment = await Payment.authenPay(req.user._id, req.body.id, req.body.isApproved)
    res.json(payment)
})
module.exports = router