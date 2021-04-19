const express = require('express')
const router = express.Router()
const passport = require('passport')

// GET: / => Logout
router.get('/', (req, res, next) => {
    req.logout()
    res.redirect('/')
})
module.exports = router