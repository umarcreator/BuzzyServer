const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, path.parse(file.originalname).name  + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

// Uploading one
router.post('/', upload.array('file'), async (req, res) => {
    // console.log(req.files)
    const images = []
    if(req.files != null) {
        try {
            req.files.forEach(i => {
                images.push(i.filename)
            })
            res.status(201).json({ message: 'Uploaded successfully!', images: images })
        } catch(e) {
            console.log('error: ', e)
            res.status(400).json({ message: e.message })
        }
    }
})

module.exports = router