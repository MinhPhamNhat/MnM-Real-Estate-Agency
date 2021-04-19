var express = require('express');
var router = express.Router();
const City = require("../repository/CityRes")
const District = require("../repository/DistrictRes")
const authenticate = require('../middleware/authenticate');


router.get('/city',authenticate.authen , async(req, res, next) => {
    var findCity = await City.getCity()
    res.json(findCity.data)
});

router.get('/district/:cityId',authenticate.authen , async(req, res, next) => {
    var cityId = req.params.cityId
    var findDistrict = await District.getDistrictByCityId(cityId)
    res.json(findDistrict.data)
});

module.exports = router;