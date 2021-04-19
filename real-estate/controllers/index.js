var express = require('express');
var router = express.Router();
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')

// GET: / => Get Home page
router.get('/', async(req, res, next) => {
    var properties = await Property.getBaseProperty({}, 0, 6, {date: -1})
    var getRange = await Statistic.getMinMaxRange()
    res.render('index', { data: properties.data , range: getRange});
});

module.exports = router;