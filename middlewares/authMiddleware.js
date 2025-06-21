const jwt = require('jsonwebtoken')

module.exports = {
    protect: function (req, res, next) {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Get token from header
                token = req.headers.authorization.split(" ")[1]

                if (!token) throw new Error("Token required")

                // Verify token
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

                // Get user from the token
                // req.user = await userServices.getUserById(decoded.id)
                req.user = decoded;

                next()
            } catch (error) {
                console.log(error)
                if (error.name === "TokenExpiredError") res.status(401).send("Session Expired")
                else res.status(401).send("Not authorized")
                // throw new Error("Not authorized")
            }
        }

        if (!token) {
            res.status(401).send("No authorization headers")
            // throw new Error("Not authorized")
        }
    },
    ensureOTP: function (req, res, next) {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Get token from header
                token = req.headers.authorization.split(" ")[1]

                if (!token) throw new Error("Token required")

                // Verify token
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

                // Get user from the token
                // req.user = await userServices.getUserById(decoded.id)
                req.tokenBody = decoded;

                next()
            } catch (error) {
                console.log(error)
                if (error.name === "TokenExpiredError") res.status(401).send("Session Expired")
                else res.status(401).send("Not authorized")
            }
        }

        if (!token) {
            res.status(401).send("No authorization headers")
            throw new Error("Not authorized")
        }
    }
}