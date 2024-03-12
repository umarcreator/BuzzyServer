const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const logout = async (req, res) => {
    let user, accessToken
    try {
        // console.log(req.headers.cookie, 'cookie')
        if(req.headers.cookie != undefined && req.headers.cookie != null) {
            const { cookie } = req.headers
            accessToken = cookie.split('token=')[1].split(';')[0]
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN)
            if(decoded) {
                user = await User.findOne({ email: decoded.email })
            }
        } else if(req.headers.auth != undefined && req.headers.auth != null) {
            const auth = req.headers.auth
            // console.log('auth: ', auth)
            const decoded = jwt.verify(auth, process.env.REFRESH_TOKEN)
            if(decoded) {
                user = await User.findOne({ email: decoded.email })
            }
        } else {
            return res.status(400).json({ message: "Auth failed: Please try again!"})
        }
        user.refreshToken = ''
        user.accessToken = user.accessToken.filter(i => {
            if(i != accessToken) {
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

module.exports = logout