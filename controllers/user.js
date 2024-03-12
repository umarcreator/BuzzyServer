const User = require('../models/User')
const emailFunction = require('./email')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const dotenv = require('dotenv')
dotenv.config()

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// verify
const verify = async (req, res) => {
    try {
        if(req.body.code) {
            if(req.body.email === res.user.email && res.user.verification?.code == req.body.code) {
                res.user.verified = true
                try {
                    let user = await res.user.save()
                    res.json({ message: "Successfully verified!" })
                } catch(e) {
                    return res.status(500).json({ message: e.message })
                }
            } else {
                return res.status(400).json({ message: "Verification failed: Code donot match!" })
            }
        } else {
            return res.status(400).json({ message: "Some fields are missing!" })
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

const reVerify = async (req, res) => {
    try {
        const random = randomNumber(100000, 999999)
        res.user.verification = { code: random, time: Date.now() }
        const email = await emailFunction(req.body.email, random);
        if(email == true) {
            await res.user.save()
            res.status(201).json({ message: 'Email sent successfully!' })
        } else {
            return res.status(500).json({ message: "Error in sending verification email!" })
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

// register
const register = async (req, res) => {
    try {
        if(req.body && req.body.email && req.body.password && req.body.name) {
            if(emailRegexp.test(req.body.email)) {
                const hash = await bcrypt.hash(req.body.password, saltRounds)
                // const random = crypto.randomBytes(16).toString('hex')
                const random = randomNumber(100000, 999999)
                const user = new User({
                    email: req.body.email,
                    password: hash,
                    name: req.body.name,
                    verification: { code: random, time: Date.now() },
                    verified: false,
                })
                console.log('trying email ...')
                const email = await emailFunction(req.body.email, random);
                if(email == true) {
                    await user.save()
                    res.status(201).json({ message: 'Successfully added user!' })
                } else {
                    return res.status(500).json({ message: "Error in sending verification email!" })
                }
            } else {
                return res.status(400).json({ message: "Email is not valid!"})
            }
        } else {
            return res.status(400).json({ message: "Some fields are missing!"})
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

// logout
const logout = async (req, res) => {
    try {
        const refreshToken = res.user.refreshToken
        const user = await User.findOne({ email: res.user.email })
        user.accessToken = []
        user.refreshToken = user.refreshToken.filter(i => {
            if(i.token != refreshToken) {
                return i
            }
        })
        await user.save()
        res.cookie('token', false, {
            origin: 'http://localhost:3000',
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }).cookie('getToken', false, {
            origin: 'http://localhost:3000',
            maxAge: 0,
            httpOnly: false,
            secure: true,
            sameSite: 'none',
        }).json({ message: 'Logout successful!'})
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

// login
const login = async (req, res) => {
    try {
        const match = await bcrypt.compare(req.body.password, res.user.password);
        if(req.body.email === res.user.email && match === true) {
            if(res.user.verified == true) {
                // const accessToken = jwt.sign({ email: req.body.email }, process.env.ACCESS_TOKEN, { expiresIn: '2m' })
                // const refreshToken = jwt.sign({ email: req.body.email }, process.env.REFRESH_TOKEN, { expiresIn: '90d' })
                const accessToken = jwt.sign({ email: req.body.email }, process.env.ACCESS_TOKEN, { expiresIn: `${process.env.ACCESS_EXPIRY}` })
                const refreshToken = jwt.sign({ email: req.body.email }, process.env.REFRESH_TOKEN, { expiresIn: `${process.env.REFRESH_EXPIRY}` })
                res.user.accessToken.push({ token: accessToken, device: '', time: Date.now() })
                res.user.refreshToken.push({ token: refreshToken, device: '', time: Date.now() })
                // res.user.refreshToken = refreshToken
                res.verification = {}
                let newUser = await res.user.save()
                let user = {
                    name: newUser.name,
                    email: newUser.email,
                    refreshToken: 'Bearer ' + refreshToken,
                    accessToken: 'Bearer ' + accessToken,
                }
                res.cookie('token', 'Bearer ' + refreshToken, {
                    origin: 'http://localhost:3000',
                    maxAge: (86400 * 30 * 3),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                }).cookie('getToken', 'mySecret', {
                    origin: 'http://localhost:3000',
                    maxAge: (86400 * 30 * 3),
                    secure: true,
                    sameSite: 'none',
                }).json(user)
            } else {
                return res.status(400).json({ message: "The user is not verified! Please verify first" })
            }
        } else {
            return res.status(400).json({ message: "Password donot match!" })
        }
    } catch(e) {
        return res.status(500).json({ message: 'error1: '+e.message })
    }
}

module.exports = {
    login,
    register,
    logout,
    verify,
    reVerify,
}