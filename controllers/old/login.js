const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const login = async (req, res) => {
    try {
        const match = await bcrypt.compare(req.body.password, res.user.password);
        // console.log(req.body, 'match: ', match)
        if(req.body.email === res.user.email && match === true) {
            if(res.user.verified == true) {
                const accessToken = jwt.sign({ email: req.body.email }, process.env.ACCESS_TOKEN, { expiresIn: '90d' })
                const refreshToken = jwt.sign({ email: req.body.email }, process.env.REFRESH_TOKEN, { expiresIn: '2m' })
                res.user.accessToken.push(accessToken)
                // res.user.refreshToken.push(refreshToken)
                res.user.refreshToken = refreshToken
                try {
                    let newUser = await res.user.save()
                    let user = {
                        name: newUser.name,
                        email: newUser.email,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    }
                    res.cookie('token', accessToken, {
                        origin: 'http://localhost:3000',
                        maxAge: (86400 * 30 * 3),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        // overwrite: true,
                    }).cookie('getToken', 'mySecret', {
                        origin: 'http://localhost:3000',
                        maxAge: (86400 * 30 * 3),
                        secure: true,
                        sameSite: 'none',
                        // overwrite: true,
                    }).json(user)
                } catch(e) {
                    return res.status(500).json({ message: e.message })
                }
            } else {
                return res.status(400).json({ message: "The user is not verified! Please verify first" })
            }
        } else {
            return res.status(400).json({ message: "Password donot match!" })
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = login