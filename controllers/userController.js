const userService = require('../services/userService')

const getAllUsers = (req, res, next) => {
    userService.getAllUsers()
        .then(result => {
            res.json(result)
        })
        .catch(next)
}

const getMe = (req, res, next) => {
    const user = req.user;
    userService.getMe(user.user._id)
        .then(result => {
            res.json(result)
        })
        .catch(e => {
            console.log(e)
            res.status(500).send("An Error occured")
        })
}

const getMyProfile = (req, res, next) => {
    const user = req.user;
    if (!user.user._id) return res.status(404).send('Not found')
    userService.getMyProfile(user.user._id)
        .then(result => {
            res.json(result)
        })
        .catch(e => {
            console.log(e)
            res.status(500).send("An Error occured")
        })
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

const updateInfo = (req, res, next) => {
    const { _id: id } = req.user.user
    const { firstname, lastname, phone, description, tags, address, dob, readyToWork } = req.body;
    userService.updateInfo(id, { firstname, lastname, phone, description, tags, address, dob, readyToWork })
        .then(result => {
            res.status(201).json({ status: true })
        })
        .catch(e => {
            console.log(e)
            res.status(500).send("An Error occured")
        })
}

const updateAUserInfo = (req, res, next) => {
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

const changePassword = async (req, res, next) => {
    const { _id: id } = req.user.user
    const { oldPassword, newPassword } = req.body
    if (!id || !oldPassword || !newPassword) {
        res.status(400).json({ error: "Please add missed fields" })
    }

    try {
        const result = await userService.changePassword(id, { oldPassword, newPassword })
        res.status(201).json({ status: true, result })
    } catch (error) {
        res.status(400).json({ error: "Invalid credientials" })
    }
}

const getSpendableBalance = (req, res, next) => {
    const user = req.user;
    userService.getSpendableBalance(user.user._id)
        .then(result => {
            res.json(result)
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
    getMe,
    getMyProfile,
    getUser,
    getUserProfile,
    updateInfo,
    changePassword,
    getSpendableBalance,
    updateBannedStatus,
    updateAUserInfo
}