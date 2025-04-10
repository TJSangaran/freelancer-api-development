const authServices = require("../services/authServices")
// const asyncHandler = require('express-async-handler')

const signup = async (req, res, next) => {
    const { firstname, lastname, email, password, phone, description, tags, address, dob, balance, isErrand, readyToWork, accountnumber, bankname, accountname } = req.body;

    try {
        const user = await authServices.signup({ firstname, lastname, email, password, phone, description, tags, address, dob, balance, isErrand, readyToWork, accountnumber, bankname, accountname })
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(400).send("Bad request")
    }
}

const login = async (req, res, next) => {
    const { email, password, rememberMe } = req.body;

    try {
        const user = await authServices.login(email, password, rememberMe)
        res.json(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const tokenRefresh = (req, res, next) => {
    const { refreshToken } = req.body
    if (!refreshToken) res.sendStatus(401)
    // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    const accessToken = authServices.tokenRefresh(refreshToken)
    res.json({ accessToken })
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) {
            res.status(400)
            throw new Error("Please add missed fields")
        }

        const result = await authServices.forgotPassword(email)
        console.log(result)
        res.json({ status: true, result })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// const getTokenDetail = (req, res, next) => {
//     const { tokenBody } = req
//     authServices.getTokenDetail(tokenBody)
//         .then(result => {
//             res.json(result)
//         })
//         .catch(e => {
//             res.sendStatus(500)
//             console.log(e)
//         })
// }

const verifyOTP = async (req, res, next) => {
    try {
        const { email, OTP } = req.body
        if (!email || !OTP) {
            res.status(400)
            throw new Error("Please add missed fields")
        }
        const result = await authServices.verifyOTP({ email, OTP })
        res.json({ status: true, result })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { email, OTP, newPassword } = req.body
        if (!email || !OTP || !newPassword) {
            res.status(400)
            throw new Error("Please add missed fields")
        }

        const result = await authServices.resetPassword({ email, OTP, newPassword })
        console.log(result)
        res.json({ status: true, result })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    signup,
    login,
    tokenRefresh,
    forgotPassword,
    // getTokenDetail,
    verifyOTP,
    resetPassword
}