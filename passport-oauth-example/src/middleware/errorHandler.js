const { ErrorResponseJSON } = require('../utils/ResponseJSON')

module.exports = async (req, res, next, err) => {
    console.log(err)
    return res
        .status(500)
        .json(new ErrorResponseJSON(500, 'Internal Server Error'))
}