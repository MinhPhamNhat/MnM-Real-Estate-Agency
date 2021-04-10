var express = require('express');
var router = express.Router();
// var property = require('../repository/property')
    /* GET home page. */
router.get('/', async(req, res, next) => {
    // var properties = await property.getProperty({}, 0, 6)
    // properties = JSON.parse(properties)
    // res.json({code: 200, message: "Welcome"});
    res.render('index')

});

module.exports = router;