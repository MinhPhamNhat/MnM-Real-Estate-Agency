
const fs = require("fs")
const convertBinaryToBase64 = (value) => {
    return Buffer.from(value.reduce((data, byte) => data + String.fromCharCode(byte), ''), 'binary').toString('base64')
}

module.exports = {
    convertImageToURL: (file) => {
        var img = fs.readFileSync(file.path);
        var encode_image = img.toString('base64');
        var image = Buffer.from(encode_image, 'base64')
        return `data:${file.mimetype};base64,${convertBinaryToBase64(image.toJSON().data)}`
    }
}