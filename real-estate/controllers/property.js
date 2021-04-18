const express = require('express')
const router = express.Router()
const Property = require('../repository/PropertyRes')
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/file')
const path = require('path')
const firebase = require('firebase-admin')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4()


router.get('/add-property',authenticate.authen, async(req, res, next) => {
    res.render('add-property', {type: false})
})

// router.get('/edit-property/:id',authenticate.authen, async (req, res, next) => {
//     const id = req.params.id
//     var property = await Property.getPropertyById(id)
//     if (property.code===0){
//         res.render('add-property', {data: property.data, type: true})
//     }else{
//         res.render('404')
//     }
// })

// router.get('/:id',async (req, res, next) => {
//     var id = req.params.id
//     if(id){
//         try{
//             var data = await Property.getPropertyById(id)
//             if (data.code===0){
//                 var nearBy = await Property.getBaseProperty({_id:{$ne: id},'location.cityId': data.data.location.cityId, 'location.districtId': data.data.location.districtId}, 0,undefined
//                 ,{date: -1})
//                 res.render('detail', {data: data.data, nearBy: nearBy.data})
//             }else{
//                 res.render("404")  
//             }
//         }catch{
//             res.render("404")  
//         } 
//     }else{
//         res.render("404")
//     }
// })

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
        res.redirect(`/properties/${newProperty.data._id}`)
    } else {
        res.render("404")
    }
})

// router.post('/:page', async (req, res, next) => {
//     var page = req.params.page
//     page = page||1
//     var data = req.body
//     var query = {
//         authorId: data.userId,
//         isSale: data.isSale === "any"||!data.isSale?undefined:data.isSale==='sale',
//         type:  data.type === "any"||!data.type?undefined:data.type,
//         'location.cityId':  data.city === "any"||!data.city?undefined:data.city,
//         'location.districtId': data.district === "any"||!data.district?undefined: data.district,
//         area: data.areaFrom&&data.areaTo?{
//             $gte: Number(data.areaFrom),
//             $lte: Number(data.areaTo)
//         }:undefined,
//         price: data.priceFrom&&data.priceTo?{
//             $gte: Number(data.priceFrom),
//             $lte: Number(data.priceTo)
//         }:undefined,
//         'features.rooms': data.rooms === "any"||!data.rooms?undefined:data.rooms === "more"?{$gte: 5}:data.rooms,
//         'features.floors': data.floors === "any"||!data.floors?undefined:data.floors === "more"?{$gte: 5}:data.floors,
//         'features.bathrooms': data.bathrooms === "any"||!data.bathrooms?undefined:data.bathrooms === "more"?{$gte: 5}:data.bathrooms,
//         'features.bedrooms': data.bedrooms === "any"||!data.bedrooms?undefined:data.bedrooms === "more"?{$gte: 5}:data.bedrooms
//     }
//     var sortBy;
//     if(data.sortBy === "price-desc"){
//         sortBy = {price: -1}
//     }else if (data.sortBy === "price-asc"){
//         sortBy = {price: 1}
//     }else if (data.sortBy==="area-desc"){
//         sortBy = {area: -1}
//     }else if (data.sortBy==="area-asc"){
//         sortBy = {area: 1}
//     }

//     var skip = page&&data.noItem?(parseInt(data.noItem)*(parseInt(page)-1)):0
//     var limit = data.noItem?parseInt(data.noItem):6

//     var properties = await Property.getBaseProperty(query,skip, limit ,sortBy)

//     var getRange = await Statistic.getMinMaxRange()

//     if (req.headers['content-type'] === 'application/x-www-form-urlencoded')
//     res.render("properties", {data: properties.data, searchData: data, range: getRange})
//     else
//     res.json({data: properties.data, userId: req.user?req.user.accountId:'' })
// })


// router.post('/edit-property/:id',authenticate.authen ,upload.array('files', 15),async (req, res, next) => {
//     const id = req.params.id
//     var data = req.body
//     if (req.files.length) {
//         const bucket = firebase.storage().bucket()
//         var images = req.files.map(img => {
//             var blob = bucket.file(img.filename)
//             const blobWriter = blob.createWriteStream({
//                 metadata: {
//                     contentType: img.mimetype,
//                     metadata: {
//                         firebaseStorageDownloadTokens: uuid,
//                     }
//                 }
//             })
//             var buffer = fs.readFileSync(path.join(__dirname, "../uploads/"+img.filename))
//             blobWriter.end(buffer)
//             blobWriter.on('error', (err) => {
//                 res.render("404")
//             })
//             return `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${img.filename}?alt=media&token=${uuid}`
//         })
//         data.thumbnail = await Promise.all(images)
//         req.files.forEach(img=>{
//             if (fs.existsSync(path.join(__dirname, "../uploads/"+img.filename)))
//             fs.unlinkSync(path.join(__dirname, "../uploads/"+img.filename))
//         })
//     }
//     var newProperty = await Property.editProperty(id, data, req.user.accountId)

//     if (newProperty.code===0) {
//         await new Promise(r => setTimeout(r, 2000));
//         res.redirect(`/properties/${newProperty.data._id}`)
//     } else {
//         res.render("404")
//     }
// })

// router.delete("/:id",authenticate.authen ,async (req, res, next) =>{
//     var id = req.params.id
//     var result = await Property.deleteProperty(id, req.user.accountId)
//     res.json(result)
// })


module.exports = router