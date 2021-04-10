const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_CONFIG, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})