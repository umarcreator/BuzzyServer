const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const newToken = async (email, refresh, access) => {
    try {
        // const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN, { expiresIn: '90d' })
        // const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '2m' })
        const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN, { expiresIn: `${process.env.REFRESH_EXPIRY}` })
        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: `${process.env.ACCESS_EXPIRY}` })
        let user = await User.findOne({ email: email })
        user.refreshToken = user.refreshToken.filter(i => {
            if(i.token != refresh && ((i.time + (90*24*60*60*1000)) > Date.now())) {
                return i
            }
        })
        user.refreshToken.push({ token: refreshToken, device: '', date: Date.now() })
        if(access) {
            user.accessToken = user.accessToken.filter(i => {
                if(i.token != access && i.time + (2*60*1000) > Date.now()) {
                    return i
                }
            })
            user.accessToken.push({ token: accessToken, device: '', date: Date.now() })
        } else {
            user.accessToken = [{ token: accessToken, device: '', date: Date.now() }]
        }
        const newUser = await user.save()
        return [accessToken, refreshToken, newUser]
    } catch(e) {
        return false
    }
}

const matchToken = async (email, token, type) => {
    try {
        const user = await User.findOne({ email: email })
        if(user) {
            if(user[type].token.includes(token)) {
                return true
            }
        }
        return false
    } catch(e) {
        return false
    }
}

const cookieDetails = {
    origin: 'http://localhost:3000',
    maxAge: (86400 * 30 * 3),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
}

const auth = async (req, res) => {
    try {
        const { cookie } = req.headers
        let token
        // console.log('cookie: ', cookie, cookie.split('token='), cookie.split('token=')[1])
        if(cookie && cookie.includes('token=')) {
            token = cookie.split('token=')[1].split(';')[0].split('%20')[1]
        } else if(req.headers.refreshtoken) {
            token = req.headers.refreshtoken.split(' ')[1]
        }
        if(token) {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if(err) {
                    // console.log('jwt error: ', token , err)
                    return res.status(401).json({ message: "Auth failed in first step!"})
                } else {
                    if(matchToken(user.email, token, 'refreshToken') !== false) {
                        const temp = await newToken(user.email, token, null)
                        if(temp !== false) {
                            const [ accessToken, refreshToken, newUser ] = temp
                            return res.cookie('token', 'Bearer '+refreshToken, cookieDetails).json({ name: newUser.name, email: newUser.email, accessToken: 'Bearer '+accessToken, refreshToken: 'Bearer '+refreshToken })
                        }
                    }
                }
            })
        } else {
            return res.status(401).json({ message: "Auth is missing!"})
        }
    } catch(e) {
        // console.log('internal server error: ', e, e.message)
        return res.status(500).json({ message: e.message })
    }
}


const renewToken = async (req, res) => {
    const { cookie } = req.headers
    let token
    if(cookie) {
        token = cookie.split('token=')[1].split(';')[0].split('%20')[1]
    } else if(req.headers.refreshToken) {
        token = req.headers.refreshToken
    }
    if(token) {
        jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
            if(err) {
                return res.status(401).json({ message: "Auth failed:1!"})
            } else {
                if(matchToken(user.email, token, 'accessToken') !== false) {
                    const temp = await newToken(user.email, token, null)
                    if(temp !== false) {
                        const [ accessToken, refreshToken, newUser ] = temp
                        res.cookie('token', 'Bearer '+refreshToken, cookieDetails).json({ accessToken: 'Bearer '+accessToken, refreshToken: 'Bearer '+refreshToken })
                    } else {
                        return res.status(500)
                    }
                } else {
                    return res.status(401).json({ message: "Auth failed in database validation:1!"})
                }
            }
        })
    } else {
        return res.status(401).json({ message: "Auth failed:2!"})
    }
}

const renewTokenApp = async (req, res) => {
    const token = req.headers.refreshToken
    const access = req.headers.accessToken
    jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if(err) {
            return res.status(401).json({ message: "Failed to refresh token!"})
        } else {
            if(matchToken(user.email, token, 'refreshToken') !== false) {
                const temp = await newToken(user.email, access, token)
                if(temp !== null) {
                    const [ accessToken, refreshToken, newUser ] = temp
                    return res.json({ email: newUser.email, refreshToken, accessToken })
                } else {
                    return res.status(500).json({ message: 'Auth failed!' })
                }
            } else {
                return res.status(401).json({ message: "Auth failed in third step!"})
            }
        }
    })
}

module.exports = {
    auth,
    renewToken,
    renewTokenApp,
}