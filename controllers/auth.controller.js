const { validationResult } = require('express-validator');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { APP_KEY } = process.env;
const { getUsersByCondition, createUser } = require('../models/user.model');
const { ResponseStatus } = require('../utils/response');

const checkValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseStatus(res, 400, 'Validation Failed', errors);
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        checkValidation(req, res);
        const existingUser = await getUsersByCondition({ username });
        console.log(existingUser);
        if (existingUser.length > 0) {
            const compare = await bcrypt.compare(password, existingUser[0].passwordHash);
            if (compare) {
                const { id } = existingUser[0];
                const token = jwt.sign({ id }, APP_KEY);
                return ResponseStatus(res, 200, 'Login successfully', {
                    token,
                    userData: existingUser[0],
                });
            } else {
                return ResponseStatus(res, 401, 'Wrong username or password');
            }
        } else {
            return ResponseStatus(res, 401, 'Username is not registered');
        }
    } catch (err) {
        console.log(err);
        return ResponseStatus(res, 400, 'Bad request');
    }
};

exports.register = async (req, res) => {
    try {
        const { fullName, username, password } = req.body;
        checkValidation(req, res);
        const isExist = await getUsersByCondition({ username });
        if (isExist.length < 1) {
            const salt = await bcrypt.genSalt();
            const encryptedPassword = await bcrypt.hash(password, salt);
            const newUser = await createUser({
                id: uuid.v4(),
                fullName,
                username,
                passwordHash: encryptedPassword,
            });
            console.log(newUser);
            if (newUser && newUser[0] && newUser[0].affectedRows > 0) {
                return ResponseStatus(res, 200, 'Register Success');
            } else {
                return ResponseStatus(res, 400, 'Register Failed');
            }
        } else {
            return ResponseStatus(res, 400, 'Register Failed, Username is already exist');
        }
    } catch (err) {
        console.log(err);
        return ResponseStatus(res, 400, 'Bad request');
    }
};
