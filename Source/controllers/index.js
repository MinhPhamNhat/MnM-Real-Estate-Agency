var express = require('express');
var router = express.Router();
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')

// GET: / => Get Home page
router.get('/', async(req, res, next) => {
    var properties = await Property.getBaseProperty({status:true}, 0, 6, {date: -1})
    var getRange = await Statistic.getMinMaxRange()
    var propertiesByLocation = {
        TP79: await Statistic.getNumberOfProperty({'location.cityId': 'TP79', status:true}),
        TP48: await Statistic.getNumberOfProperty({'location.cityId': 'TP48', status:true}),
        TP46: await Statistic.getNumberOfProperty({'location.cityId': 'TP46', status:true}),
        TP01: await Statistic.getNumberOfProperty({'location.cityId': 'TP01', status:true}),
        TP31: await Statistic.getNumberOfProperty({'location.cityId': 'TP31', status:true})
    }
    res.status(200).render('index', { data: properties.data , range: getRange, propertiesByLocation});
});

module.exports = router;