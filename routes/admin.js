const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')

// Uploading product
router.post('/product', adminController.uploadProduct)

// Uploading images
router.post('/image-upload', adminController.upload.array('file'), adminController.imageUpload)

module.exports = router