var express = require('express');
var router = express.Router();
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')

// GET: / => Get Home page
router.get('/', async(req, res, next) => {
    var properties = await Property.getBaseProperty({}, 0, 6, {date: -1})
    var getRange = await Statistic.getMinMaxRange()
    var propertiesByLocation = {
        TP79: await Statistic.getNumberOfProperty({'location.cityId': 'TP79'}),
        TP48: await Statistic.getNumberOfProperty({'location.cityId': 'TP48'}),
        TP46: await Statistic.getNumberOfProperty({'location.cityId': 'TP46'}),
        TP01: await Statistic.getNumberOfProperty({'location.cityId': 'TP01'}),
        TP31: await Statistic.getNumberOfProperty({'location.cityId': 'TP31'})
    }
    res.render('index', { data: properties.data , range: getRange, propertiesByLocation});
});

module.exports = router;