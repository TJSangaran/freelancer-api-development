const userService = require('../../services/admin/userService')

const getAllUsers = (req, res, next) => {
    userService.getAllUsers()
        .then(result => {
            res.json(result)
        })
        .catch(next)
}

const getUser = (req, res, next) => {
    const { userId } = req.params;
    userService.getUser(userId)
        .then(result => {
            res.json(result)
        })
        .catch(e => {
            console.log(e)
            res.status(500).send("An Error occured")
        })
}

const getUserProfile = (req, res, next) => {
    const { userId } = req.params;
    userService.getMyProfile(userId)
        .then(result => {
            res.json(result)
        })
        .catch(e => {
            console.log(e)
            res.status(500).send("An Error occured")
        })
}

const updateUserInfo = (req, res, next) => {
    const { userId } = req.params
    const { firstname, lastname, phone, description, tags, address, dob, readyToWork } = req.body;
    userService.updateAUserInfo({ userId, firstname, lastname, phone, description, tags, address, dob, readyToWork })
        .then(result => {
            res.status(201).json({ status: true })
        })
        .catch(e => {
            console.log(e)
            res.status(500).send("An Error occured")
        })
}

const updateBannedStatus = (req, res, next) => {
    const { userId } = req.params;
    const { banned } = req.body;
    userService
        .updateBannedStatus({ userId, banned })
        .then((result) => {
            res.status(201).json({ status: true });
        })
        .catch((e) => {
            console.log(e);
            res.status(500).send("An Error occured");
        });
};

module.exports = {
    getAllUsers,
    getUser,
    getUserProfile,
    updateBannedStatus,
    updateUserInfo
}