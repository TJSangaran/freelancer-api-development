const User = require('../models/User')

exports.getErrands = () => {
    return User.aggregate([
        {
            $match: {
                isErrand: true,
                readyToWork: true,
                banned: false
            }
        }
    ])
}