const jwt = require('jsonwebtoken');

exports.login = async (email, password, rememberMe) => {
    if (email === 'admin@gmail.com' && password === 'Admin@123') {
        const encryptedUser = {
            user: {
                _id: '123456',
                email: 'admin@gmail.com'
            },
            type: 'authorization',
            role: 'admin'
        }

        return {
            accessToken: generateAccessToken(encryptedUser),
            refreshToken: generateRefreshToken(encryptedUser, rememberMe),
        };
    } else {
        throw new Error("Invalid credientials")
    }
}

exports.tokenRefresh = (refreshToken) => {
    try {
        const decodedUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        delete decodedUser.exp
        delete decodedUser.iat
        const accessToken = generateAccessToken(decodedUser)
        return accessToken;
    } catch (error) {
        console.log(error)
        throw { success: false, error: error.message, statusCode: 401 }
    }
}



exports.logout = (userId) => {

}

const generateAccessToken = (object) => {
    return jwt.sign(object, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',

    })
}

const generateRefreshToken = (object, rememberMe) => {
    return jwt.sign(object, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: rememberMe ? '4w' : '5d',
    })
}