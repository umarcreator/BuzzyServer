const User = require('../models/User')
const jwt = require('jsonwebtoken')

// const matchToken = async (email, token, type) => {
//     try {
//         const user = await User.findOne({ email: email })
//         if(user == null) {
//             return false
//         }
//         if(user[type].token.includes(token)) {
//             return true
//         } else {
//             return false
//         }
//     } catch(e) {
//         return false
//     }
// }
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

const verifyToken = async (req, res, next) => {
    if(req.headers.accesstoken) {
        const token = req.headers.accesstoken.includes('Bearer') ? req.headers.accesstoken.split(' ')[1] : req.headers.accesstoken
        // console.log('accessToken: ', token)
        jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
            if(err) {
                // console.log('jwt err: ', err)
                return res.status(401).json({ message: "Auth failed!"})
            } else {
                if(matchToken(user.email, token, 'accessToken') !== false) {
                    res.email = user.email
                    next()
                } else {
                    return res.status(401).json({ message: "Auth failed in second step!"})
                }
            }
        })  
    } else {
        return res.status(401).json({ message: 'Auth is missing!' })
    }
}

const verifyRefreshToken = async (req, res, next) => {
    try {
        const { cookie } = req.headers
        let token
        if(cookie) {
            token = cookie.split('token=')[1].split(';')[0].split('%20')[1]
        } else if(req.headers.refreshtoken) {
            token = req.headers.refreshtoken.split(' ')[1]
        }
        if(token) {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if(err) {
                    // console.log(err)
                    return res.status(401).json({ message: "Auth failed in first step!"})
                } else {
                    if(matchToken(user.email, token, 'refreshToken') !== false) {
                        res.user = { email: user.email, refreshToken: token }
                        next()
                    }
                }
            })
        } else {
            return res.status(401).json({ message: "Auth is missing!"})
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = {
    verifyToken,
    verifyRefreshToken,
}