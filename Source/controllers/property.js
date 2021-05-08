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
const func = require('../function/function');
const User = require('../repository/UserRes');


// GET: /add-property => Get add-property page
router.get('/add-property',authenticate.authen,async (req, res, next) => {
    var user = await User.findUserById(req.user.accountId)
    if (user.data.phone)
        res.status(200).render('add-property', {type: false})
    else{
        req.flash('requireInformation',true)
        res.redirect(`/profile/property/${user.data.accountId}`)
    }
})

// GET: /edit-property => Edit property
router.get('/edit-property/:id',authenticate.authen, async (req, res, next) => {
    const id = req.params.id
    var property = await Property.getProperty({_id:id, authorId: req.user.accountId})
    if (property.code===0){
        res.status(200).render('add-property', {data: property.data, type: true})
    }else{
        res.status(404).render('404')
    }
})

// GET: /search => Search for properties
router.get('/search', async (req, res, next) => {
    var data = req.query
    var query = func.parseQuery(data)
    var sortBy = func.parseSort(data)
    var page =  parseInt(data.page)||1
    var skip = (parseInt(data.noItem)*(page-1))||0
    var limit = parseInt(data.noItem)||6
    await Property.getBaseProperty(query,skip, limit ,sortBy).then(async properties => {
        var getRange = await Statistic.getMinMaxRange()
        var numOfDoc = await Statistic.getNumberOfProperty(query)
        var pageRange = func.createPageRange(page, Math.ceil(numOfDoc/limit))

        data.priceFrom = data.priceFrom || getRange.minPrice
        data.priceTo = data.priceTo || getRange.maxPrice
        data.areaFrom = data.areaFrom || getRange.minArea
        data.areaTo = data.areaTo || getRange.maxArea
        if (data.submit === "form")
            res.status(200).render("properties", 
            {
                data: properties.data, 
                searchData: data, 
                range: getRange, 
                pageRange, page
            })
        else
            res.status(200).json(
                {
                    data: properties.data, 
                    userId: req.user?req.user.accountId:'', 
                    pageRange, page, 
                    isAdmin: req.user?req.user.role:false 
                })
        }).catch(err=>{
            res.status(404).render('404')
        })
})

// GET: /id => Get detail property by id
router.get('/:id', async(req, res, next) => {
    var id = req.params.id
    try{
        var data = await Property.getProperty({_id:id, status: true})
        if (data.code===0){
            var nearBy = await Property.getBaseProperty(
                {_id:{$ne: id},
                'location.cityId': data.data.location.city.id, 
                'location.districtId': data.data.location.district.id,
                status: true
            }, 0, undefined, {date: -1})
            var author = await User.findUserById(data.data.authorId)
            var authorProperty = await Property.getBaseProperty({authorId: data.data.authorId, status: true},0,3,{date: -1})
            var numOfDoc = await Statistic.getNumberOfProperty({authorId: data.data.authorId, status: true})
            res.status(200).render('detail', {
                data: data.data, 
                nearBy: nearBy.data, 
                author: author.data, 
                authorProperty: authorProperty.data,
                numOfDoc
            })
        }else{
            res.status(404).render("404")  
        }
    }catch{
        res.status(404).render("404")  
    }
})

// POST: / => Add propery
router.post('/',authenticate.authen, upload.array('files', 15), async(req, res, next) => {
    var data = req.body
    if (req.files && req.files.length) {
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
                res.status(404).render("404")
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
        await new Promise(r => setTimeout(r, 2000));
        res.redirect(`/censor/${newProperty.data._id}`)
    } else {
        res.status(404).render("404")
    }
})

// POST: /edit-property/id
router.post('/edit-property/:id',authenticate.authen ,upload.array('files', 15),async (req, res, next) => {
    const id = req.params.id
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
                res.status(404).render("404")
            })
            return `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${img.filename}?alt=media&token=${uuid}`
        })
        data.thumbnail = await Promise.all(images)
        req.files.forEach(img=>{
            if (fs.existsSync(path.join(__dirname, "../uploads/"+img.filename)))
            fs.unlinkSync(path.join(__dirname, "../uploads/"+img.filename))
        })
    }
    var newProperty = await Property.editProperty(id, data, req.user.accountId)

    if (newProperty.code===0) {
        await new Promise(r => setTimeout(r, 2000));
        res.redirect(`/censor/${newProperty.data._id}`)
    } else {
        res.status(404).render("404")
    }
})

// DELETE: /id => Delete propety
router.delete("/:id",authenticate.authen ,async (req, res, next) =>{
    var id = req.params.id
    var result = await Property.deleteProperty(id, req.user.accountId, req.user.role)
    res.status(200).json(result)
})

module.exports = router