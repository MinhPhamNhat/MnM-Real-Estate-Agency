var express = require('express');
var router = express.Router();
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')
// var property = require('../repository/property')
    /* GET home page. */
router.get('/', async(req, res, next) => {
    console.log({
        HELLO: "HELLO"
    })
    var properties = await Property.getBaseProperty({}, 0, 6, {date: -1})
    var getRange = await Statistic.getMinMaxRange()
    res.render('index', { data: properties.data , range: getRange});
});

module.exports = router;