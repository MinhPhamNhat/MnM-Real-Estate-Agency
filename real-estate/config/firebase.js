const admin = require('firebase-admin')
const serviceAccount  = require('../service/realestateagency-ccf40-firebase-adminsdk-o7lb8-e5bd2ca8e2.json')

const {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID} = process.env

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET
  })
  