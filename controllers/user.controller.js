const bcrypt = require('bcrypt');
const { APP_URL } = process.env;
const { getUsersById, updateUser } = require('../models/user.model');
const { ResponseStatus } = require('../utils/response');

exports.getUser = async (req, res) => {
    const { id } = req.params;
    const results = await getUsersById(id);
    if (results.length > 0) {
        return ResponseStatus(res, 200, 'List Detail user', results[0]);
    } else {
        return ResponseStatus(res, 400, 'User not found');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;
        const salt = await bcrypt.genSalt();
        const initialResult = await getUsersById(id);
        if (initialResult.length < 1) {
            return ResponseStatus(res, 404, 'User not found');
        }

        if (password) {
            const encryptedNewPassword = await bcrypt.hash(password, salt);
            const passwordResult = await updateUser(id, {
                password: encryptedNewPassword,
            });
            if (passwordResult.affectedRows > 0) {
                return ResponseStatus(res, 200, 'Password have been updated');
            }
            return ResponseStatus(res, 400, 'Password cant update');
        }

        if (req.file) {
            const picture = `${APP_URL}${req.file.destination}/${req.file.filename}`;
            const uploadImage = await updateUser(id, { picture });
            if (uploadImage.affectedRows > 0) {
                // if (initialResult[0].picture !== null) {
                //   fs.unlink(`${initialResult[0].picture}`);
                // }
                return ResponseStatus(res, 200, 'Image hash been Updated');
            }
            return ResponseStatus(res, 400, "Can't update Image");
        }

        const finalResult = await updateUser(id, data);
        if (finalResult.affectedRows > 0) {
            return ResponseStatus(res, 200, 'data successfully updated', {
                ...initialResult[0],
                ...data,
            });
        }
        return ResponseStatus(res, 400, 'Failed to update data');
    } catch (err) {
        console.log(err);
        return ResponseStatus(res, 400, 'Bad Request');
    }
};
