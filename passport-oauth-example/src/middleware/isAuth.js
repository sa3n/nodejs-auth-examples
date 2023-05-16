const { ErrorResponseJSON } = require('../utils/ResponseJSON')

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } 
    return res
        .status(401)
        .json(new ErrorResponseJSON(401, 'Unauthorized'))
}
