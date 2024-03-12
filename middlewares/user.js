const User = require('../models/User')

// User Register middleware
async function registerMiddleware(req, res, next) {
    try {
        if(req.body && req.body.email && req.body.password && req.body.name) {
            const user = await User.findOne({ email: req.body.email })
            if(user) {
                return res.status(403).json({ message: "User is already registered. Please try to login instead of register!"})
            } else {
                next()
            }
        } else {
            return res.status(400).json({ message: "Some fields are missing!"})
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

// User Login middleware
async function loginMiddleware(req, res, next) {
    let user
    try {
        if(req.body && req.body.email && req.body.password) {
            user = await User.findOne({ email: req.body.email })
            if(user == null) {
                return res.status(404).json({ message: "User could not found. Please register for account first!"})
            }
        } else {
            return res.status(400).json({ message: "Email or password is missing!"})
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
    res.user = user
    next()
}

// Verify User middleware
async function verifyMiddleware(req, res, next) {
    try {
        if(req.body && req.body.email) {
            const user = await User.findOne({ email: req.body.email })
            if(user == null) {
                return res.status(403).json({ message: "The user is not registered. Please register first!"})
            } else {
                res.user = user
                next()
            }
        } else {
            return res.status(400).json({ message: "Some fields are missing!"})
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = {
    registerMiddleware,
    loginMiddleware,
    verifyMiddleware,
}