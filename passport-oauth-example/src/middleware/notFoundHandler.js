const { ErrorResponseJSON } = require('../utils/ResponseJSON')

module.exports = (req, res, next) => {
    return res
        .status(404)
        .json(new ErrorResponseJSON(404, 'Not Found'))
}