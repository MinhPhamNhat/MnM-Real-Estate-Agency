const express = require('express')
const router = express.Router()
const validator = require('../middleware/validator')
const { validationResult } = require("express-validator")
const Account = require("../repository/AccountRes")
router.get('/', (req, res, next) => {
    var err = req.flash("err")
    var data = req.flash("data")
    res.render('register', {err: err.length? err[0]:'', data: data.length? data[0]:''})
})

router.post('/', validator.registerValidator(), async (req, res, next) => {
    var validate = validationResult(req)
    if (validate.errors.length) {
        let errors = validate.mapped()
        for (field in errors ){
            req.flash('err', errors[field])
            req.flash('data', req.body)
            return res.redirect("/register")
        }
    } else {
        var newAccount = await Account.createAccount(req.body)
        newAccount = JSON.parse(newAccount)
        if (newAccount.code === 0){
            return res.redirect("/login")
        }else if (newAccount.code === -1){
            req.flash('err', newAccount.err)
            req.flash('data', req.body)
            return res.redirect("/register")
        }else{
            return res.redirect("/register")
        }
    }
    
})

module.exports = router