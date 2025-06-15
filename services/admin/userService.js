const User = require('../../models/User');

exports.getAllUsers = () => {
    return User.aggregate([
        {
            $project: {
                password: 0
            }
        }
    ])
}

exports.getUser = async (userId) => {
    return User.findById(userId);
};

exports.updateUserInfo = ({ userId, firstname, lastname, phone, description, tags, address, dob, readyToWork }) => {
    return User.updateOne({ _id: userId }, {
        $set: { firstname, lastname, phone, description, tags, address, dob, readyToWork }
    })
}

exports.updateBannedStatus = ({ userId, banned }) => {
    return User.updateOne({ _id: userId }, {
        $set: { banned }
    })
}