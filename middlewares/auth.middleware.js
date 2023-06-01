const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const { APP_KEY } = process.env;
const { ResponseStatus } = require('../utils/response');

module.exports = {
    validateRegister: [
        body('username')
            .exists()
            .withMessage('Username is required.')
            .isLength({ min: 3 })
            .withMessage('Username must contain at least 3 characters'),
        body('password')
            .exists()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must contain at least 6 characters'),
        body('confirm_password')
            .exists()
            .withMessage('Password must be confirmed')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Both passwords must match');
                }
                return true;
            }),
    ],
    validateLogin: [
        body('username').exists().withMessage('Username is required.'),
        body('password').exists().withMessage('Password is required'),
    ],
};

exports.authCheck = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        const token = authorization.substr(7);
        const data = jwt.verify(token, APP_KEY);
        if (data) {
            req.userData = data;
            return next();
        }
    }
    return ResponseStatus(res, 401, 'Authorization needed');
};
