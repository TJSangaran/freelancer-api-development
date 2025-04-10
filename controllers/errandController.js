const errandService = require('../services/errandService')

const getErrands = (req, res) => {
    errandService.getErrands()
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        })
}

module.exports = {
    getErrands
}