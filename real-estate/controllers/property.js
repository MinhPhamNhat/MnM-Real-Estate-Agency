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


// GET: /add-property => Get add-property page
router.get('/add-property',authenticate.authen,(req, res, next) => {
    res.render('add-property', {type: false})
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

// POST: /page => Search for properties
router.post('/search', async (req, res, next) => {
    console.log(req.body)
    res.render("properties")
})

module.exports = router