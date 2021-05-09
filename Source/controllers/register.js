const express = require('express')
const router = express.Router()
const validator = require('../middleware/validator')
const { validationResult } = require("express-validator")
const Account = require("../repository/AccountRes")
const { response } = require('../app')

// GET: / => Get register page
router.get('/', (req, res, next) => {
    var err = req.flash("err")
    var data = req.flash("data")
    res.render('register', {err: err.length? err[0]:'', data: data.length? data[0]:''})
})

// POST: / => Recieve register data, validate
router.post('/', validator.registerValidator(), (req, res, next) => {
    var validate = validationResult(req)
    if (validate.errors.length) {
        let errors = validate.mapped()
        for (field in errors ){
            req.flash('err', errors[field])
            req.flash('data', req.body)
            return res.redirect(422, "/register")
        }
    } else {
        return Account.createAccount(req.body)
        .then(newAccount=>{
            if (newAccount.code === 0){
                return res.redirect(200,"/login")
            }else if (newAccount.code === -1){
                req.flash('err', newAccount.err)
                req.flash('data', req.body)
                return res.redirect(409,"/register")
            }
        }).catch(err=> {
                return res.redirect(500,"/register")
        })
        
    }
    
})

module.exports = router