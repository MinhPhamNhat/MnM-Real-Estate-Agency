const express = require('express')
const router = express.Router()
const passport = require('passport')
const validator = require('../middleware/validator')
const { validationResult } = require("express-validator")

// GET: / => Get login page
router.get('/', (req, res, next) => {
    var message = req.flash("error")
    if (message.length) 
        res.render('login', { message: message[0] })
    else
        res.render("login")
})

// POST: / => Get login data, validate and create session
router.post('/', passport.authenticate("local-login", { 
    successReturnToOrRedirect: '/', 
    failureRedirect: '/login', 
    failureFlash: true,
    badRequestMessage: "Vui lòng nhập tài khoản và mật khẩu" }))

module.exports = router