const express = require('express')
const router = express.Router()
const validator = require('../middleware/validator')
const { validationResult } = require("express-validator")
const Account = require("../repository/AccountRes")
const { response } = require('../app')

// GET: / => Get register page
router.get('/', (req, res, next) => {
    res.status(200).render('register', {err: '', data: ''})
})

// POST: / => Recieve register data, validate
router.post('/', validator.registerValidator(), (req, res, next) => {
    var validate = validationResult(req)
    if (validate.errors.length) {
        let errors = validate.mapped()
        for (field in errors ){
            req.flash('err', errors[field])
            req.flash('data', req.body)
            return res.status(422).render("register", {err: errors[field], data: req.body})
        }
    } else {
        return Account.createAccount(req.body)
        .then(newAccount=>{
            if (newAccount.code === 0){
                return res.redirect(200,"/login")
            }else if (newAccount.code === -1){
                req.flash('err', newAccount.err)
                req.flash('data', req.body)
                return res.status(409).render("register", {err: newAccount.err, data: req.body})
            }
        }).catch(err=> {
                return res.status(404).render("404")
        })
        
    }
    
})

module.exports = router