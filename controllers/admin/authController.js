const authServices = require("../../services/admin/authServices")

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

module.exports = {
    login,
    tokenRefresh,
}