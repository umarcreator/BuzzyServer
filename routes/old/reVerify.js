const express = require('express')
const router = express.Router()
const { reVerify } = require('../../controllers/old/verfiy')
const { verifyMiddleware } = require('../../middlewares/user')

// Getting user
router.post('/', verifyMiddleware, reVerify)

module.exports = router