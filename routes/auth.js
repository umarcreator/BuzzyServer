const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

// Route: /auth
router.get('/', authController.auth)

// Route: /auth/renew
router.get('/renew', authController.renewToken)

router.get('/renew-app', authController.renewTokenApp)

module.exports = router