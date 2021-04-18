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


router.get('/add-property',authenticate.authen,(req, res, next) => {
    console.log({
        HELLO: "HELLO"
    })
    res.render('add-property', {type: false})
})

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

module.exports = router