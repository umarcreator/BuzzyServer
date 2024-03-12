const Products = require('../models/Products')
const multer = require('multer')
const path = require('path')

const uploadProduct = async (req, res) => {
    if(req.body.code) {
        const product = new Products({
            code: req.body.code,
            title: req.body.title,
            company: req.body.company,
            description: req.body.description,
            keywords: req.body.keywords,
            images: req.body.images,
            variation_type: req.body.variation_type,
            price: req.body.price,
            price2: req.body.price2,
            stock: req.body.stock,
            weight: req.body.weight
        })
        try {
            const newProduct = await product.save()
            res.status(201).json(newProduct)
        } catch(e) {
            console.log('error: ', e)
            res.status(400).json({ message: e.message })
        }
    } else {
        return res.status(400).json({ message: "Some fields are missing!"})
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, path.parse(file.originalname).name  + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

const imageUpload = async (req, res) => {
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
}

module.exports = {
    uploadProduct,
    imageUpload,
    upload,
}