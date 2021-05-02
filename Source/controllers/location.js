var express = require('express');
var router = express.Router();
const City = require("../repository/CityRes")
const District = require("../repository/DistrictRes")


router.get('/city', async(req, res, next) => {
    var findCity = await City.getCity()
    res.json(findCity.data)
});

router.get('/district/:cityId', async(req, res, next) => {
    var cityId = req.params.cityId
    var findDistrict = await District.getDistrictByCityId(cityId)
    res.json(findDistrict.data)
});

module.exports = router;