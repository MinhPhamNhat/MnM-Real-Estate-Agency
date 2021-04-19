const express = require('express')
const router = express.Router()
const Property = require('../repository/PropertyRes')
const Statistic = require('../repository/StatisticRes')
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/file')
const path = require('path')
const firebase = require('firebase-admin')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4()
const func = require('../function/function')


// GET: /add-property => Get add-property page
router.get('/add-property',authenticate.authen,(req, res, next) => {
    res.render('add-property', {type: false})
})

// GET: search/page => Search for properties
router.get('/search', async (req, res, next) => {
    var page = Number(req.query.page)
    page = page||1
    var data = req.query
    var query = {
        authorId: data.userId==="undefined"?undefined:data.userId,
        isSale: data.isSale === "any"||!data.isSale?undefined:data.isSale==='sale',
        type:  data.type === "any"||!data.type?undefined:data.type,
        'location.cityId':  data.city === "any"||!data.city?undefined:data.city,
        'location.districtId': data.district === "any"||!data.district?undefined: data.district,
        area: data.areaFrom&&data.areaTo?{
            $gte: Number(data.areaFrom),
            $lte: Number(data.areaTo)
        }:undefined,
        price: data.priceFrom&&data.priceTo?{
            $gte: Number(data.priceFrom),
            $lte: Number(data.priceTo)
        }:undefined,
        'features.rooms': data.rooms === "any"||!data.rooms?undefined:data.rooms === "more"?{$gte: 5}:data.rooms,
        'features.floors': data.floors === "any"||!data.floors?undefined:data.floors === "more"?{$gte: 5}:data.floors,
        'features.bathrooms': data.bathrooms === "any"||!data.bathrooms?undefined:data.bathrooms === "more"?{$gte: 5}:data.bathrooms,
        'features.bedrooms': data.bedrooms === "any"||!data.bedrooms?undefined:data.bedrooms === "more"?{$gte: 5}:data.bedrooms
    }
    var sortBy = {}
    if(data.sortPrice === "asc-price"){
        sortBy = {...sortBy,price: 1}
    }else if(data.sortPrice === "desc-price"){
        sortBy = {...sortBy,price: -1}
    }

    if(data.sortArea === "asc-area"){
        sortBy = {...sortBy,area: 1}
    }else if(data.sortArea === "desc-area"){
        sortBy = {...sortBy,area: -1}
    } 

    if(data.sortDate === "asc-date"){
        sortBy = {...sortBy,date: 1}
    }else if(data.sortDate === "desc-date"){
        sortBy = {...sortBy,date: -1}
    }

    var skip = page&&data.noItem?(parseInt(data.noItem)*(parseInt(page)-1)):0
    var limit = data.noItem?parseInt(data.noItem):6

    var properties = await Property.getBaseProperty(query,skip, limit ,sortBy)

    var getRange = await Statistic.getMinMaxRange()

    var numOfDoc = await Statistic.getNumberOfProperty(query)
    console.log(limit)
    var pageRange = func.createPageRange(page, Math.ceil(numOfDoc/limit))

    if (data.submit === "form")
    res.render("properties", {data: properties.data, searchData: data, range: getRange, pageRange, page})
    else
    res.json({data: properties.data, userId: req.user?req.user.accountId:'', pageRange, page })
})

// GET: /id => Get detail property by id
router.get('/:id', async(req, res, next) => {
    var id = req.params.id
    if(id){
        try{
            var data = await Property.getPropertyById(id)
            if (data.code===0){
                var nearBy = await Property.getBaseProperty({_id:{$ne: id},'location.cityId': data.data.location.cityId, 'location.districtId': data.data.location.districtId}, 0,undefined
                ,{date: -1})
                res.render('detail', {data: data.data, nearBy: nearBy.data})
            }else{
                res.render("404")  
            }
        }catch{
            res.render("404")  
        } 
    }else{
        res.render("404")
    }
})

// POST: / => Add propery
router.post('/',authenticate.authen, upload.array('files', 15), async(req, res, next) => {
    var data = req.body
    if (req.files.length) {
        const bucket = firebase.storage().bucket()
        var images = req.files.map(img => {
            var blob = bucket.file(img.filename)
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: img.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: uuid,
                    }
                }
            })
            var buffer = fs.readFileSync(path.join(__dirname, "../uploads/"+img.filename))
            blobWriter.end(buffer)
            blobWriter.on('error', (err) => {
                res.render("404")
            })
            return `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${img.filename}?alt=media&token=${uuid}`
        })
        data.thumbnail = await Promise.all(images)
        req.files.forEach(img=>{
            if (fs.existsSync(path.join(__dirname, "../uploads/"+img.filename)))
            fs.unlinkSync(path.join(__dirname, "../uploads/"+img.filename))
        })
    }
    var newProperty = await Property.createProperty(data, req.user.accountId)

    if (newProperty.code === 0) {
        await new Promise(r => setTimeout(r, 1500));
        res.redirect(`/property/${newProperty.data._id}`)
    } else {
        res.render("404")
    }
})


module.exports = router